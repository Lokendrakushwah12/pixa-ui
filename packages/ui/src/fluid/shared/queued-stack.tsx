"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { FileThumbnail } from "../../components/fluid/file-thumbnail";
import { Tooltip } from "../../components/fluid/tooltip";
import { type QueuedMessage } from "../../components/fluid/input-message";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { useSizeVariant } from "../../fluid/lib/size-context";
import { spring } from "../../fluid/lib/springs";

export const QUEUE_CARD_H = 44;
export const QUEUE_CARD_H_COMPACT = 38;
const STACK_PEEK = 12;
const STACK_SCALE = 0.05;
const STACK_GAP = 8;
const STACK_MAX_PEEK = 2;

export function useQueueCardHeight() {
  return useSizeVariant() === "compact" ? QUEUE_CARD_H_COMPACT : QUEUE_CARD_H;
}

export function collapsedStackHeight(count: number, cardH: number) {
  return cardH + Math.min(Math.max(count - 1, 0), STACK_MAX_PEEK) * STACK_PEEK;
}

interface QueuedStackProps {
  queue: QueuedMessage[];
  onQueueChange: (queue: QueuedMessage[]) => void;
  onEdit: (item: QueuedMessage) => void;
  onRemove: (item: QueuedMessage) => void;
  bottom: number;
  morphLayoutId?: (item: QueuedMessage) => string;
}

export function QueuedStack({
  queue,
  onQueueChange,
  onEdit,
  onRemove,
  bottom,
  morphLayoutId,
}: QueuedStackProps) {
  const shape = useShape();
  const compactStep = useSizeVariant() === "compact";
  const cardH = useQueueCardHeight();
  const XIcon = useIcon("x");
  const PencilIcon = useIcon("pencil");
  const ChevronDownIcon = useIcon("chevron-down");
  const CornerDownRightIcon = useIcon("corner-down-right");

  const stackCount = queue.length;
  const collapsedStackH = collapsedStackHeight(stackCount, cardH);
  const expandedStackH =
    stackCount * cardH + Math.max(stackCount - 1, 0) * STACK_GAP;
  const hiddenCount = Math.max(0, stackCount - (STACK_MAX_PEEK + 1));

  const stackRef = useRef<HTMLDivElement>(null);
  const [stackHovered, setStackHovered] = useState(false);
  const [pointerDownId, setPointerDownId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const dragStartYRef = useRef(0);
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const [isTouch, setIsTouch] = useState(false);
  const [tapExpanded, setTapExpanded] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (queue.length === 0) setTapExpanded(false);
  }, [queue.length]);

  const stackExpanded =
    stackHovered ||
    pointerDownId !== null ||
    draggingId !== null ||
    tapExpanded;
  const slotY = (i: number) => -i * (cardH + STACK_GAP);

  const stackBump = useAnimationControls();
  const prevStackCountRef = useRef(stackCount);
  useEffect(() => {
    const prev = prevStackCountRef.current;
    prevStackCountRef.current = stackCount;
    if (stackCount > prev && prev > 0 && !stackExpanded) {
      stackBump.set({ y: -7 });
      stackBump.start({
        y: 0,
        transition: { type: "spring", duration: 0.42, bounce: 0.5 },
      });
    }
    // Only react to the count changing.
  }, [stackCount]);

  useEffect(() => {
    if (!pointerDownId) return;
    let started = false;
    const onMove = (e: PointerEvent) => {
      const el = stackRef.current;
      if (!el) return;
      if (!started) {
        if (Math.abs(e.clientY - dragStartYRef.current) < 4) return;
        started = true;
        setDraggingId(pointerDownId);
      }
      const rect = el.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      const q = queueRef.current;
      const slot = Math.max(
        0,
        Math.min(q.length - 1, Math.floor(fromBottom / (cardH + STACK_GAP)))
      );
      const cur = q.findIndex((x) => x.id === pointerDownId);
      if (cur !== -1 && cur !== slot) {
        const moved = q[cur];
        const next = [...q];
        next.splice(cur, 1);
        next.splice(slot, 0, moved);
        onQueueChange(next);
      }
      const minY = -(queueRef.current.length - 1) * (cardH + STACK_GAP);
      setDragY(
        Math.max(minY, Math.min(0, e.clientY - rect.bottom + cardH / 2))
      );
    };
    const onUp = () => {
      setPointerDownId(null);
      setDraggingId(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [pointerDownId, cardH, onQueueChange]);

  return (
    <AnimatePresence>
      {stackCount > 0 && (
        <motion.div
          ref={stackRef}
          className="absolute inset-x-0 z-10"
          style={{ bottom }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            height: stackExpanded ? expandedStackH : collapsedStackH,
          }}
          exit={{ opacity: 0 }}
          transition={{ ...spring.moderate, bounce: 0 }}
          onMouseEnter={() => setStackHovered(true)}
          onMouseLeave={() => setStackHovered(false)}
        >
          <motion.div animate={stackBump} className="absolute inset-0">
            {isTouch && stackExpanded ? (
              <Tooltip content="Collapse" side="left">
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTapExpanded(false);
                  }}
                  aria-label="Collapse queued messages"
                  className={`absolute bottom-0 left-0 flex items-center justify-center text-muted-foreground outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)] ${shape.button}`}
                  style={{ height: cardH, width: 40 }}
                >
                  <ChevronDownIcon size={18} strokeWidth={2} />
                </button>
              </Tooltip>
            ) : (
              <Tooltip
                content={`${stackCount} queued message${stackCount === 1 ? "" : "s"}`}
                side="left"
              >
                <div
                  className="absolute bottom-0 left-0 flex items-center justify-end gap-1 pr-1 text-muted-foreground"
                  style={{ height: cardH, width: 40 }}
                >
                  <AnimatePresence>
                    {hiddenCount > 0 && (
                      <motion.span
                        key="count"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={spring.fast}
                        className="pointer-events-none text-[10px] font-semibold leading-none tabular-nums text-muted-foreground"
                      >
                        {stackCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <CornerDownRightIcon size={16} strokeWidth={2} />
                </div>
              </Tooltip>
            )}
            <AnimatePresence initial={false}>
              {queue.map((item, i) => {
                const peek = Math.min(i, STACK_MAX_PEEK);
                const isDragging = draggingId === item.id;
                const target = stackExpanded
                  ? {
                      y: isDragging ? dragY : slotY(i),
                      scale: isDragging ? 1.03 : 1,
                      opacity: 1,
                    }
                  : {
                      y: -peek * STACK_PEEK,
                      scale: 1 - peek * STACK_SCALE,
                      opacity: i <= STACK_MAX_PEEK ? 1 : 0,
                    };
                return (
                  <motion.div
                    key={item.id}
                    layoutId={
                      morphLayoutId &&
                      pointerDownId === null &&
                      item.files.length === 0
                        ? morphLayoutId(item)
                        : undefined
                    }
                    onDoubleClick={() => onEdit(item)}
                    onClick={() => {
                      if (isTouch && !stackExpanded) setTapExpanded(true);
                    }}
                    onPointerDown={(e) => {
                      if (!stackExpanded || e.button !== 0) return;
                      dragStartYRef.current = e.clientY;
                      setDragY(slotY(i));
                      setPointerDownId(item.id);
                    }}
                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                    animate={target}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.12 },
                    }}
                    transition={isDragging ? { duration: 0 } : spring.moderate}
                    style={{
                      height: cardH,
                      transformOrigin: "bottom center",
                      zIndex: isDragging ? 200 : 100 - i,
                      cursor: stackExpanded ? "grab" : "default",
                      touchAction: stackExpanded ? "none" : undefined,
                    }}
                    className={`group/qm absolute bottom-0 left-10 right-10 flex select-none items-center bg-[color-mix(in_oklab,var(--accent),var(--background)_68%)] ${
                      compactStep
                        ? `gap-1.5 ${item.files.length > 0 ? "pl-1.5" : "pl-3"} pr-1`
                        : `gap-2 ${item.files.length > 0 ? "pl-2" : "pl-3.5"} pr-1.5`
                    } text-subtitle text-muted-foreground shadow-surface-3 active:cursor-grabbing ${shape.bg}`}
                  >
                    {item.files.length > 0 && (
                      <div className="pointer-events-none flex shrink-0 items-center gap-1">
                        {item.files.slice(0, 3).map((f, fi) => (
                          <FileThumbnail
                            key={`${f.name}-${f.size}-${fi}`}
                            file={f}
                            size={compactStep ? 24 : 28}
                            className="rounded-md"
                          />
                        ))}
                        {item.files.length > 3 && (
                          <span className={`flex ${compactStep ? "h-6 w-6" : "h-7 w-7"} items-center justify-center rounded-md bg-background/40 text-[11px] font-medium tabular-nums text-foreground/80`}>
                            +{item.files.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="pointer-events-none min-w-0 flex-1 truncate">
                      {item.text ||
                        `${item.files.length} attachment${
                          item.files.length === 1 ? "" : "s"
                        }`}
                    </span>
                    <div
                      className={`shrink-0 items-center gap-1 ${
                        isTouch ? "flex" : "hidden group-hover/qm:flex"
                      }`}
                    >
                      <Tooltip content="Edit" side="top">
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          aria-label={`Edit queued message: ${item.text}`}
                          className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center ${shape.button} text-muted-foreground outline-none hover:bg-hover hover:text-foreground focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]`}
                        >
                          <PencilIcon size={14} strokeWidth={2} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Remove" side="top">
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item);
                          }}
                          aria-label={`Remove queued message: ${item.text}`}
                          className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center ${shape.button} text-muted-foreground outline-none hover:bg-hover hover:text-foreground focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]`}
                        >
                          <XIcon size={14} strokeWidth={2.5} />
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
