"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";

interface ProgressProps
  extends Omit<
    ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    "value" | "children"
  > {
  value?: number | null;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const indeterminate = value === null;
    const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value ?? 0));

    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        value={indeterminate ? undefined : clamped}
        className={cn(
          "relative h-1.5 w-full overflow-hidden rounded-full bg-muted",
          className
        )}
        {...props}
      >
        {indeterminate ? (
          <motion.div
            className="h-full w-1/3 rounded-full bg-primary"
            animate={reduceMotion ? { x: "100%" } : { x: ["-100%", "300%"] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ) : (
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${clamped}%` }}
            transition={reduceMotion ? { duration: 0 } : spring.moderate}
          />
        )}
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps };
