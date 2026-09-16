"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "../../lib/utils";

const Separator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    data-slot="separator"
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
