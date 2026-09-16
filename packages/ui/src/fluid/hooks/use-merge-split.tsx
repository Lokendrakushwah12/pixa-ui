"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../fluid/lib/springs";
import type { ItemRect } from "../../fluid/hooks/use-fluid-hover";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const mergeSpring = spring.moderate;
const cornerDelay = 0.07;
const convergeMs = (mergeSpring.duration + cornerDelay) * 1000 + 80;
const splitMs = mergeSpring.duration * 1000 + 80;

type Rect = { top: number; left: number; width: number; height: number };
export interface SelBlock extends Rect {
  key: string;
  radii: [number, number, number, number];
  instant: boolean;
  exitInstant: boolean;
  delayCorners: boolean;
  cornerDelay?: number;
  opacity?: number;
  enterFrom?: { top: number; height: number; radii: [number, number, number, number] };
}

export type Run = { start: number; end: number; id: number };

export function useSelectionRuns(checkedIndices: readonly number[]): Run[] {
  const prevGroupMap = useRef(new Map<number, number>());
  const groupIdCounter = useRef(0);

  const runs: { start: number; end: number }[] = [];
  const sorted = [...checkedIndices].sort((a, b) => a - b);
  for (const idx of sorted) {
    const last = runs[runs.length - 1];
    if (last && idx === last.end + 1) last.end = idx;
    else runs.push({ start: idx, end: idx });
  }

  const usedIds = new Set<number>();
  const nextGroupMap = new Map<number, number>();
  const result = runs.map((run) => {
    let stableId: number | null = null;
    for (let i = run.start; i <= run.end; i++) {
      const prevId = prevGroupMap.current.get(i);
      if (prevId !== undefined && !usedIds.has(prevId)) {
        stableId = prevId;
        break;
      }
    }
    const id = stableId ?? ++groupIdCounter.current;
    usedIds.add(id);
    for (let i = run.start; i <= run.end; i++) nextGroupMap.set(i, id);
    return { ...run, id };
  });
  prevGroupMap.current = nextGroupMap;
  return result;
}

interface Boundary {
  tid: number;
  kind: "merge" | "split";
  survivorId: number;
  otherId: number;
  gapIndex: number;
  phase: "converge" | "commit" | "splitIn" | "diverge";
}

function bridgePair(outer: Run, runs: Run[]) {
  const inside = runs
    .filter((r) => r.start >= outer.start && r.end <= outer.end)
    .sort((a, b) => a.start - b.start);
  if (inside.length !== 2) return null;
  const [up, lo] = inside;
  return lo.start === up.end + 2 ? { up, lo, gap: up.end + 1 } : null;
}

export function useMergeSplitBlocks(
  runs: Run[],
  itemRects: ItemRect[],
  R: number
): SelBlock[] {
  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const prevRunsRef = useRef<Run[]>([]);
  const tidRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const runsSig = runs.map((g) => `${g.id}:${g.start}-${g.end}`).join("|");

  useIsoLayoutEffect(() => {
    const prev = prevRunsRef.current;
    const cur = runs;
    const found: Boundary[] = [];
    for (const c of cur) {
      const p = bridgePair(c, prev);
      if (p && (c.id === p.up.id || c.id === p.lo.id))
        found.push({
          tid: ++tidRef.current,
          kind: "merge",
          survivorId: c.id,
          otherId: c.id === p.up.id ? p.lo.id : p.up.id,
          gapIndex: p.gap,
          phase: "converge",
        });
    }
    for (const p of prev) {
      const c = bridgePair(p, cur);
      if (c)
        found.push({
          tid: ++tidRef.current,
          kind: "split",
          survivorId: c.up.id,
          otherId: c.lo.id,
          gapIndex: c.gap,
          phase: "splitIn",
        });
    }
    prevRunsRef.current = cur.map((r) => ({ ...r }));
    for (const b of found) {
      timersRef.current.set(
        b.tid,
        setTimeout(() => {
          timersRef.current.delete(b.tid);
          setBoundaries((bs) =>
            bs.some((x) => x.tid === b.tid)
              ? bs.flatMap((x) =>
                  x.tid !== b.tid
                    ? [x]
                    : x.kind === "merge"
                    ? [{ ...x, phase: "commit" as const }]
                    : []
                )
              : bs
          );
        }, b.kind === "merge" ? convergeMs : splitMs)
      );
    }
    const stillValid = (b: Boundary) =>
      b.kind === "merge"
        ? cur.some(
            (c) =>
              c.id === b.survivorId &&
              b.gapIndex > c.start &&
              b.gapIndex < c.end
          )
        : cur.some((c) => c.id === b.survivorId && c.end === b.gapIndex - 1) &&
          cur.some((c) => c.id === b.otherId && c.start === b.gapIndex + 1);
    setBoundaries((active) => {
      for (const b of active) {
        if (stillValid(b)) continue;
        const timer = timersRef.current.get(b.tid);
        if (timer !== undefined) {
          clearTimeout(timer);
          timersRef.current.delete(b.tid);
        }
      }
      return [...active.filter(stillValid), ...found];
    });
  }, [runsSig]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!boundaries.some((b) => b.phase === "splitIn" || b.phase === "commit"))
      return;
    setBoundaries((bs) =>
      bs.flatMap((b) =>
        b.phase === "commit"
          ? []
          : [{ ...b, phase: b.phase === "splitIn" ? "diverge" : b.phase }]
      )
    );
  }, [boundaries]);

  const rectOf = (start: number, end: number): Rect | null => {
    const s = itemRects[start];
    const e = itemRects[end];
    if (!s || !e) return null;
    return {
      top: s.top,
      left: Math.min(s.left, e.left),
      width: Math.max(s.width, e.width),
      height: e.top + e.height - s.top,
    };
  };
  const blocks: SelBlock[] = [];
  for (const run of runs) {
    const r = rectOf(run.start, run.end);
    if (r)
      blocks.push({
        key: `sel-${run.id}`,
        ...r,
        radii: [R, R, R, R],
        instant: false,
        exitInstant: false,
        delayCorners: false,
      });
  }
  const byId = new Map(blocks.map((b) => [b.key, b]));
  for (const b of boundaries) {
    const gap = itemRects[b.gapIndex];
    const sv = byId.get(`sel-${b.survivorId}`);
    if (!gap || !sv) continue;
    const midY = gap.top + gap.height / 2;
    if (b.kind === "merge") {
      if (b.phase === "commit") {
        sv.instant = true;
        blocks.push({
          key: `sel-${b.otherId}`,
          top: midY,
          left: sv.left,
          width: sv.width,
          height: sv.top + sv.height - midY,
          radii: [0, 0, R, R],
          instant: true,
          exitInstant: true,
          delayCorners: false,
          opacity: 0,
        });
        continue;
      }
      const mergeCornerDelay = Math.min(
        cornerDelay + 0.03,
        Math.max(cornerDelay, cornerDelay + (midY / Math.max(gap.height, 1)) * 0.002)
      );
      const bottom = sv.top + sv.height;
      sv.height = midY - sv.top;
      sv.radii = [R, R, 0, 0];
      sv.delayCorners = true;
      sv.cornerDelay = mergeCornerDelay;
      blocks.push({
        key: `sel-${b.otherId}`,
        top: midY,
        left: sv.left,
        width: sv.width,
        height: bottom - midY,
        radii: [0, 0, R, R],
        enterFrom: { top: midY, height: bottom - midY, radii: [R, R, R, R] },
        instant: false,
        exitInstant: true,
        delayCorners: true,
        cornerDelay: mergeCornerDelay,
      });
    } else if (b.phase === "splitIn") {
      const lo = byId.get(`sel-${b.otherId}`);
      if (!lo) continue;
      const bottom = lo.top + lo.height;
      sv.height = midY - sv.top;
      sv.radii = [R, R, 0, 0];
      sv.instant = true;
      lo.top = midY;
      lo.height = bottom - midY;
      lo.radii = [0, 0, R, R];
      lo.instant = true;
      lo.enterFrom = { top: midY, height: bottom - midY, radii: [0, 0, R, R] };
    }
    // diverge: nothing to override — the steady blocks spring to their real
    // rects from the seam; the timer drops the boundary.
  }

  for (const p of prevRunsRef.current) {
    const c = bridgePair(p, runs);
    const gap = c && itemRects[c.gap];
    if (!c || !gap) continue;
    const midY = gap.top + gap.height / 2;
    const up = byId.get(`sel-${c.up.id}`);
    const lo = byId.get(`sel-${c.lo.id}`);
    if (!up || !lo) continue;
    const bottom = lo.top + lo.height;
    up.height = midY - up.top;
    up.radii = [R, R, 0, 0];
    up.instant = true;
    lo.top = midY;
    lo.height = bottom - midY;
    lo.radii = [0, 0, R, R];
    lo.instant = true;
    lo.enterFrom = { top: midY, height: bottom - midY, radii: [0, 0, R, R] };
  }

  return blocks;
}

export function SelectionBackgrounds({
  blocks,
}: {
  blocks: SelBlock[];
}) {
  return (
    <AnimatePresence>
      {blocks.map((b) => {
        const corner = b.delayCorners
          ? { ...mergeSpring, delay: b.cornerDelay ?? cornerDelay }
          : mergeSpring;
        const opacity = b.opacity ?? 1;
        return (
          <motion.div
            key={b.key}
            aria-hidden
            className="absolute bg-active pointer-events-none"
            initial={
              b.enterFrom
                ? {
                    opacity,
                    top: b.enterFrom.top,
                    left: b.left,
                    width: b.width,
                    height: b.enterFrom.height,
                    borderTopLeftRadius: b.enterFrom.radii[0],
                    borderTopRightRadius: b.enterFrom.radii[1],
                    borderBottomRightRadius: b.enterFrom.radii[2],
                    borderBottomLeftRadius: b.enterFrom.radii[3],
                  }
                : false
            }
            animate={{
              top: b.top,
              left: b.left,
              width: b.width,
              height: b.height,
              borderTopLeftRadius: b.radii[0],
              borderTopRightRadius: b.radii[1],
              borderBottomRightRadius: b.radii[2],
              borderBottomLeftRadius: b.radii[3],
              opacity,
            }}
            exit={{ opacity: 0, transition: b.exitInstant ? { duration: 0 } : mergeSpring.exit }}
            transition={
              b.instant
                ? { duration: 0 }
                : {
                    ...mergeSpring,
                    borderTopLeftRadius: corner,
                    borderTopRightRadius: corner,
                    borderBottomRightRadius: corner,
                    borderBottomLeftRadius: corner,
                    opacity: { duration: 0.08 },
                  }
            }
          />
        );
      })}
    </AnimatePresence>
  );
}
