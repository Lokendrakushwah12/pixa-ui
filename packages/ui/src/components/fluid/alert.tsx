"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";

const alertVariants = cva(
  "relative flex w-full gap-3 border p-3 text-[13px] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-px",
  {
    variants: {
      tone: {
        default: "border-border bg-background text-foreground [&>svg]:text-muted-foreground",
        info: "border-blue-500/30 bg-blue-500/5 text-foreground [&>svg]:text-blue-500",
        success: "border-green-500/30 bg-green-500/5 text-foreground [&>svg]:text-green-500",
        warning: "border-amber-500/30 bg-amber-500/5 text-foreground [&>svg]:text-amber-500",
        danger: "border-destructive/30 bg-destructive/5 text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: { tone: "default" },
  }
);

interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone, ...props }, ref) => {
    const shape = useShape();
    return (
      <div
        ref={ref}
        role={tone === "danger" ? "alert" : "note"}
        data-slot="alert"
        className={cn(alertVariants({ tone }), shape.container, className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

function AlertTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-medium", className)} {...props} />;
}

function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground", className)} {...props} />;
}

function AlertContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-col gap-0.5", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, AlertContent, alertVariants };
export type { AlertProps };
