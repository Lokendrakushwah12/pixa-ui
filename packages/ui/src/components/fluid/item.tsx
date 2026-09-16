"use client";

import type { HTMLAttributes } from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../../lib/utils";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useShape } from "../../fluid/lib/shape-context";

interface ItemProps extends useRender.ComponentProps<"div"> {
  size?: SizeVariant;
  interactive?: boolean;
}

function Item({ size, interactive, className, render, ...props }: ItemProps) {
  const sizeClasses = useSize(size);
  const shape = useShape();

  return useRender({
    defaultTagName: "div",
    props: {
      "data-slot": "item",
      className: cn(
        "flex w-full items-center gap-3 text-left",
        sizeClasses.itemPx,
        sizeClasses.text,
        "py-2",
        shape.item,
        interactive && [
          "cursor-pointer transition-colors duration-100",
          "hover:bg-accent hover:text-accent-foreground",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
        ],
        className
      ),
      ...props,
    },
    render,
  });
}

function ItemMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="item-media"
      className={cn("flex shrink-0 items-center justify-center [&>svg]:size-4", className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("truncate font-medium", className)} {...props} />;
}

function ItemDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("truncate text-[12px] text-muted-foreground", className)} {...props} />
  );
}

function ItemActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="item-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

function ItemGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("flex flex-col [&>*+*]:border-t [&>*+*]:border-border", className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
};
export type { ItemProps };
