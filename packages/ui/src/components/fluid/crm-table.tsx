"use client";

import { useMemo, useState, type ReactNode } from "react";

import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/fluid/table";

type SortDirection = "asc" | "desc";

interface Column<T> {
  id: string;
  header: ReactNode;
  accessor: (row: T) => string | number | null | undefined;
  cell?: (row: T) => ReactNode;
  align?: "start" | "end";
  sortable?: boolean;
  className?: string;
}

interface CrmTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowId: (row: T) => string;
  selected?: Set<string>;
  onSelectedChange?: (next: Set<string>) => void;
  query?: string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
}

function isEmpty(v: unknown): boolean {
  return v === null || v === undefined || v === "";
}

function compare(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function CrmTable<T>({
  rows,
  columns,
  rowId,
  selected,
  onSelectedChange,
  query,
  onRowClick,
  empty,
  className,
}: CrmTableProps<T>) {
  const ChevronUp = useIcon("chevrons-up-down");
  const CheckIcon = useIcon("check");
  const [sort, setSort] = useState<{ id: string; dir: SortDirection } | null>(null);

  const selectable = selected !== undefined && onSelectedChange !== undefined;

  const visible = useMemo(() => {
    let out = rows;

    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((row) =>
        columns.some((col) => String(col.accessor(row) ?? "").toLowerCase().includes(q))
      );
    }

    if (sort) {
      const col = columns.find((c) => c.id === sort.id);
      if (col) {
        out = [...out].sort((a, b) => {
          const av = col.accessor(a);
          const bv = col.accessor(b);

          if (isEmpty(av) && isEmpty(bv)) return 0;
          if (isEmpty(av)) return 1;
          if (isEmpty(bv)) return -1;

          const result = compare(av, bv);
          return sort.dir === "asc" ? result : -result;
        });
      }
    }

    return out;
  }, [rows, columns, query, sort]);

  const allShownSelected =
    selectable && visible.length > 0 && visible.every((r) => selected!.has(rowId(r)));

  const toggleAll = () => {
    if (!selectable) return;
    const next = new Set(selected);
    if (allShownSelected) visible.forEach((r) => next.delete(rowId(r)));
    else visible.forEach((r) => next.add(rowId(r)));
    onSelectedChange!(next);
  };

  const toggleRow = (id: string) => {
    if (!selectable) return;
    const next = new Set(selected);
    if (!next.delete(id)) next.add(id);
    onSelectedChange!(next);
  };

  const cycleSort = (id: string) =>
    setSort((prev) =>
      prev?.id !== id
        ? { id, dir: "asc" }
        : prev.dir === "asc"
          ? { id, dir: "desc" }
          : null
    );

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-8">
                <Checkbox
                  checked={allShownSelected}
                  onChange={toggleAll}
                  label={allShownSelected ? "Deselect all" : "Select all"}
                  icon={<CheckIcon />}
                />
              </TableHead>
            )}
            {columns.map((col) => {
              const active = sort?.id === col.id;
              return (
                <TableHead
                  key={col.id}
                  aria-sort={
                    active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={cn(col.align === "end" && "text-right", col.className)}
                >
                  {col.sortable === false ? (
                    col.header
                  ) : (
                    <button
                      type="button"
                      onClick={() => cycleSort(col.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm",
                        "transition-colors duration-100 hover:text-foreground",
                        "outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {col.header}
                      <ChevronUp
                        className={cn(
                          "size-3",
                          active ? "opacity-100" : "opacity-30",
                          active && sort!.dir === "desc" && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="py-8 text-center text-muted-foreground"
              >
                {empty ?? "No matching records"}
              </TableCell>
            </TableRow>
          ) : (
            visible.map((row) => {
              const id = rowId(row);
              const isSelected = selectable && selected!.has(id);
              return (
                <TableRow
                  key={id}
                  data-state={isSelected ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    isSelected && "bg-accent/50",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {selectable && (
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={!!isSelected}
                        onChange={() => toggleRow(id)}
                        label={`Select row ${id}`}
                        icon={<CheckIcon />}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(col.align === "end" && "text-right tabular-nums")}
                    >
                      {col.cell ? col.cell(row) : (col.accessor(row) ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className={cn(
          "peer size-4 cursor-pointer appearance-none rounded-[4px] border border-border bg-background",
          "checked:border-primary checked:bg-primary",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring"
        )}
      />
      <span className="pointer-events-none absolute hidden text-primary-foreground peer-checked:block [&>svg]:size-3">
        {icon}
      </span>
    </span>
  );
}

export { CrmTable };
export type { CrmTableProps, Column, SortDirection };
