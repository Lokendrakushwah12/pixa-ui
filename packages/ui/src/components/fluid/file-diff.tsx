"use client";

import { useMemo } from "react";
import { diffLines, type Change } from "diff";

import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";

type DiffRowKind = "added" | "removed" | "context";

interface DiffRow {
  kind: DiffRowKind;
  oldLine?: number;
  newLine?: number;
  text: string;
}

function useDiffRows(oldText: string, newText: string): DiffRow[] {
  return useMemo(() => {
    const changes: Change[] = diffLines(oldText, newText);
    const rows: DiffRow[] = [];
    let oldLine = 1;
    let newLine = 1;

    for (const change of changes) {
      const lines = change.value.split("\n");
      if (lines[lines.length - 1] === "") lines.pop();

      for (const text of lines) {
        if (change.added) {
          rows.push({ kind: "added", newLine: newLine++, text });
        } else if (change.removed) {
          rows.push({ kind: "removed", oldLine: oldLine++, text });
        } else {
          rows.push({ kind: "context", oldLine: oldLine++, newLine: newLine++, text });
        }
      }
    }
    return rows;
  }, [oldText, newText]);
}

const rowStyles: Record<DiffRowKind, string> = {
  added: "bg-green-500/10",
  removed: "bg-destructive/10",
  context: "",
};

const rowSign: Record<DiffRowKind, string> = {
  added: "+",
  removed: "−",
  context: " ",
};

interface FileDiffProps {
  oldText: string;
  newText: string;
  filename?: string;
  context?: number;
  className?: string;
}

function FileDiff({ oldText, newText, filename, context, className }: FileDiffProps) {
  const shape = useShape();
  const rows = useDiffRows(oldText, newText);

  const visible = useMemo(() => {
    if (context === undefined) return rows.map((row, i) => ({ row, index: i }));

    const keep = new Set<number>();
    rows.forEach((row, i) => {
      if (row.kind === "context") return;
      for (let j = i - context; j <= i + context; j++) {
        if (j >= 0 && j < rows.length) keep.add(j);
      }
    });

    const out: ({ row: DiffRow; index: number } | { gap: true; index: number })[] = [];
    let gapOpen = false;
    rows.forEach((row, i) => {
      if (keep.has(i)) {
        out.push({ row, index: i });
        gapOpen = false;
      } else if (!gapOpen) {
        out.push({ gap: true, index: i });
        gapOpen = true;
      }
    });
    return out;
  }, [rows, context]);

  const added = rows.filter((r) => r.kind === "added").length;
  const removed = rows.filter((r) => r.kind === "removed").length;

  return (
    <div
      data-slot="file-diff"
      className={cn("overflow-hidden border border-border", shape.container, className)}
    >
      <div className="flex items-center gap-3 border-b border-border px-3 py-1.5 text-[12px]">
        <span className="truncate text-muted-foreground">{filename ?? "diff"}</span>
        <span className="ml-auto shrink-0 tabular-nums">
          <span className="text-green-600 dark:text-green-500">+{added}</span>
          <span className="ml-2 text-destructive">−{removed}</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12px] leading-relaxed">
          <tbody>
            {visible.map((entry) =>
              "gap" in entry ? (
                <tr key={`gap-${entry.index}`}>
                  <td colSpan={4} className="bg-muted/40 px-3 py-0.5 text-center text-muted-foreground">
                    ⋯
                  </td>
                </tr>
              ) : (
                <tr key={entry.index} className={rowStyles[entry.row.kind]}>
                  <td className="w-10 select-none border-r border-border/50 px-2 text-right text-muted-foreground/60 tabular-nums">
                    {entry.row.oldLine ?? ""}
                  </td>
                  <td className="w-10 select-none border-r border-border/50 px-2 text-right text-muted-foreground/60 tabular-nums">
                    {entry.row.newLine ?? ""}
                  </td>
                  <td className="w-4 select-none pl-2 text-muted-foreground">
                    {rowSign[entry.row.kind]}
                  </td>
                  <td className="whitespace-pre pr-3">{entry.row.text}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { FileDiff, useDiffRows };
export type { FileDiffProps, DiffRow, DiffRowKind };
