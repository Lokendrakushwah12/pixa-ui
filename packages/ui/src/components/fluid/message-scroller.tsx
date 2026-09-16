"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";

const BOTTOM_THRESHOLD = 32;

interface MessageScrollerProps {
  children: ReactNode;
  dep?: unknown;
  className?: string;
  hideJumpButton?: boolean;
}

function MessageScroller({
  children,
  dep,
  className,
  hideJumpButton = false,
}: MessageScrollerProps) {
  const ArrowDown = useIcon("arrow-down");
  const shape = useShape();
  const ref = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(true);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setPinned(distance <= BOTTOM_THRESHOLD);
  }, []);

  const jump = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useLayoutEffect(() => {
    if (pinned) jump("auto");
    // `pinned` is deliberately not a dependency: this runs when content
    // arrives, and reads the latest pin state at that moment. Including it
    // would re-scroll the moment the reader scrolled back down, fighting them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, jump]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (pinned) jump("auto");
    });
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [pinned, jump, dep]);

  return (
    <div className={cn("relative min-h-0", className)}>
      <div
        ref={ref}
        onScroll={measure}
        data-slot="message-scroller"
        className="flex h-full flex-col gap-3 overflow-y-auto"
      >
        {children}
      </div>

      {!hideJumpButton && !pinned && (
        <button
          type="button"
          onClick={() => jump()}
          className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2",
            "flex items-center gap-1.5 border border-border bg-background px-2.5 py-1",
            "text-[12px] text-muted-foreground shadow-surface-3",
            "transition-colors duration-100 hover:text-foreground",
            "outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "[&>svg]:size-3.5",
            shape.button
          )}
        >
          <ArrowDown />
          Jump to latest
        </button>
      )}
    </div>
  );
}

export { MessageScroller };
export type { MessageScrollerProps };
