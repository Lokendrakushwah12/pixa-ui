"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../lib/utils";
import { useSizeVariant, type SizeVariant } from "../../fluid/lib/size-context";

interface AvatarProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: SizeVariant;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size, className, ...props }, ref) => {
    const variant = useSizeVariant(size);
    return (
      <AvatarPrimitive.Root
        ref={ref}
        data-slot="avatar"
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          variant === "compact" ? "size-5 text-[10px]" : "size-7 text-[11px]",
          className
        )}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "flex size-full items-center justify-center rounded-full",
      "bg-muted font-medium text-muted-foreground uppercase",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

function AvatarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center [&>*:not(:first-child)]:-ml-2",
        "[&>*]:ring-2 [&>*]:ring-background",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
export type { AvatarProps };
