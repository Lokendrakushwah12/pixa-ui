"use client";

import { type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

function Empty({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
      {...props}
    />
  );
}

function EmptyMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="empty-media"
      aria-hidden
      className={cn(
        "flex size-10 items-center justify-center rounded-full",
        "bg-muted text-muted-foreground [&>svg]:size-5",
        className
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[14px] font-medium text-foreground", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("max-w-sm text-[13px] text-muted-foreground", className)}
      {...props}
    />
  );
}

function EmptyActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-1 flex items-center gap-2", className)} {...props} />;
}

export { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyActions };
