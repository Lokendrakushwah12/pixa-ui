"use client";

import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const shape = useShape();
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse bg-muted", shape.bg, className)}
      {...props}
    />
  );
}

export { Skeleton };
