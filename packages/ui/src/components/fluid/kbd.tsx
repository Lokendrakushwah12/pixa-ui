"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useSizeVariant, type SizeVariant } from "../../fluid/lib/size-context";

interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: SizeVariant;
}

const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ size, className, ...props }, ref) => {
    const variant = useSizeVariant(size);
    return (
      <kbd
        ref={ref}
        data-slot="kbd"
        className={cn(
          "inline-flex items-center justify-center rounded border border-border",
          "bg-muted font-sans font-medium text-muted-foreground",
          variant === "compact"
            ? "h-4 min-w-4 px-1 text-[10px]"
            : "h-5 min-w-5 px-1.5 text-[11px]",
          className
        )}
        {...props}
      />
    );
  }
);
Kbd.displayName = "Kbd";

export { Kbd };
export type { KbdProps };
