"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "../../lib/utils";

interface SeparatorProps
  extends ComponentPropsWithoutRef<typeof SeparatorPrimitive> {
  /**
   * Base UI has no `decorative` prop; a purely visual rule is expressed by
   * taking it out of the accessibility tree instead.
   */
  decorative?: boolean;
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive
      ref={ref}
      data-slot="separator"
      orientation={orientation}
      {...(decorative ? { "aria-hidden": true, role: "none" } : {})}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };
