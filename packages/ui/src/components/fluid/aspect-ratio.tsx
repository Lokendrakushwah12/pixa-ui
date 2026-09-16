"use client";

import type { ComponentProps } from "react";

import { cn } from "../../lib/utils";

interface AspectRatioProps extends ComponentProps<"div"> {
  ratio?: number;
}

function AspectRatio({ ratio = 1, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      data-slot="aspect-ratio"
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    />
  );
}

export { AspectRatio };
export type { AspectRatioProps };
