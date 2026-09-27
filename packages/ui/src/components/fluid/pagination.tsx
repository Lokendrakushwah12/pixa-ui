"use client";

import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";

type PageEntry = number | "gap";

function usePageRange(page: number, total: number, siblings = 1): PageEntry[] {
  if (total <= siblings * 2 + 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, total);
  const showLeftGap = left > 2;
  const showRightGap = right < total - 1;

  const entries: PageEntry[] = [1];
  if (showLeftGap) entries.push("gap");
  for (let p = Math.max(left, 2); p <= Math.min(right, total - 1); p++) {
    entries.push(p);
  }
  if (showRightGap) entries.push("gap");
  entries.push(total);
  return entries;
}

const Pagination = forwardRef<HTMLElement, ComponentPropsWithoutRef<"nav">>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
);
Pagination.displayName = "Pagination";

interface PaginationButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "aria-current"> {
  active?: boolean;
  size?: SizeVariant;
}

const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ active, size, className, ...props }, ref) => {
    const sizeClasses = useSize(size);
    const shape = useShape();
    return (
      <button
        ref={ref}
        type="button"
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex items-center justify-center tabular-nums transition-colors duration-100",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-40",
          sizeClasses.variant === "compact" ? "size-7 text-[12px]" : "size-8 text-[13px]",
          shape.button,
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
PaginationButton.displayName = "PaginationButton";

function PaginationGap({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={cn("px-1 text-[13px] text-muted-foreground", className)}
      {...props}
    >
      …
    </span>
  );
}

interface PaginationControlProps {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  size?: SizeVariant;
  className?: string;
}

function PaginationControl({
  page,
  total,
  onPageChange,
  siblings = 1,
  size,
  className,
}: PaginationControlProps) {
  const ChevronLeft = useIcon("arrow-left");
  const ChevronRight = useIcon("arrow-right");
  const entries = usePageRange(page, total, siblings);

  return (
    <Pagination className={className}>
      <PaginationButton
        size={size}
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </PaginationButton>

      {entries.map((entry, i) =>
        entry === "gap" ? (
          <PaginationGap key={`gap-${i}`} />
        ) : (
          <PaginationButton
            key={entry}
            size={size}
            active={entry === page}
            aria-label={`Page ${entry}`}
            onClick={() => onPageChange(entry)}
          >
            {entry}
          </PaginationButton>
        )
      )}

      <PaginationButton
        size={size}
        aria-label="Next page"
        disabled={page >= total}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </PaginationButton>
    </Pagination>
  );
}

export {
  Pagination,
  PaginationButton,
  PaginationGap,
  PaginationControl,
  usePageRange,
};
export type { PaginationControlProps, PageEntry };
