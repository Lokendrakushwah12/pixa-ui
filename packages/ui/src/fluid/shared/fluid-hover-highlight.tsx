"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import type { ItemRect, UseFluidHoverReturn } from "../../fluid/hooks/use-fluid-hover";

export type FluidHoverSource = Pick<
  UseFluidHoverReturn,
  "activeIndex" | "itemRects" | "isMeasured" | "sessionRef"
>;

interface HighlightFromHook {
  hover: FluidHoverSource;
  hidden?: boolean;
  rect?: never;
  session?: never;
}

interface HighlightFromRect {
  rect: ItemRect | null;
  session: number;
  hover?: never;
  hidden?: never;
}

export type FluidHoverHighlightProps = (HighlightFromHook | HighlightFromRect) & {
  from?: ItemRect | null;
  className?: string;
  transition?: Transition | false;
};

const fade: Transition = { duration: 0.08 };
const snap: Transition = { duration: 0 };

export function toTarget(rect: ItemRect) {
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}

export function resolveHighlightTransition(
  transition: Transition | false | undefined,
  reduceMotion: boolean
): Transition {
  const positional =
    transition === false || reduceMotion ? snap : (transition ?? spring.fast);
  return { ...positional, opacity: fade };
}

export function resolveHighlightSource(
  props: FluidHoverHighlightProps
): { rect: ItemRect | null; session: number } {
  if (props.hover) {
    const { activeIndex, itemRects, isMeasured, sessionRef } = props.hover;
    const rect =
      !props.hidden && isMeasured && activeIndex !== null
        ? (itemRects[activeIndex] ?? null)
        : null;
    return { rect, session: sessionRef.current };
  }
  return { rect: props.rect, session: props.session };
}

export function FluidHoverHighlight(props: FluidHoverHighlightProps) {
  const { from, className, transition } = props;
  const { rect, session } = resolveHighlightSource(props);
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <AnimatePresence>
      {rect && (
        <motion.div
          key={session}
          data-slot="fluid-hover-highlight"
          className={cn(
            "pointer-events-none absolute left-0 top-0 bg-hover",
            className
          )}
          initial={{ opacity: 0, ...toTarget(from ?? rect) }}
          animate={{ opacity: 1, ...toTarget(rect) }}
          exit={{ opacity: 0, transition: spring.fast.exit }}
          transition={resolveHighlightTransition(transition, reduceMotion)}
        />
      )}
    </AnimatePresence>
  );
}
