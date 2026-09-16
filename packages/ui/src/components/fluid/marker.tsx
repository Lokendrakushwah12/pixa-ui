"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type MarkerTone = "default" | "info" | "success" | "warning" | "danger";

const toneStyles: Record<MarkerTone, string> = {
  default: "bg-muted-foreground/15 text-foreground",
  info: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  success: "bg-green-500/15 text-green-700 dark:text-green-300",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  danger: "bg-destructive/15 text-destructive",
};

interface MarkerProps extends HTMLAttributes<HTMLElement> {
  tone?: MarkerTone;
  label?: string;
  children?: ReactNode;
}

function Marker({ tone = "default", label, className, children, ...props }: MarkerProps) {
  return (
    <mark
      data-slot="marker"
      className={cn(
        "rounded-[3px] px-0.5 py-px",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {label && <span className="sr-only">{label}: </span>}
      {children}
    </mark>
  );
}

export { Marker };
export type { MarkerProps, MarkerTone };
