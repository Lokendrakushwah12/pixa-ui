"use client";

import { type ComponentPropsWithoutRef } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "../../lib/utils";

const ResizableGroup = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Group>) => (
  <Group
    data-slot="resizable-group"
    className={cn("flex h-full w-full data-[orientation=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Panel>) => (
  <Panel data-slot="resizable-panel" className={cn("min-h-0 min-w-0", className)} {...props} />
);

const ResizableHandle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Separator>) => (
  <Separator
    data-slot="resizable-handle"
    className={cn(
      "group relative flex items-center justify-center bg-border",
      "outline-none transition-colors duration-100",
      "focus-visible:bg-ring data-[dragging]:bg-ring",
      "w-px cursor-col-resize",
      "[[data-orientation=vertical]_&]:h-px [[data-orientation=vertical]_&]:w-full",
      "[[data-orientation=vertical]_&]:cursor-row-resize",
      "before:absolute before:-inset-x-[3px] before:inset-y-0 before:content-['']",
      "[[data-orientation=vertical]_&]:before:-inset-y-[3px]",
      "[[data-orientation=vertical]_&]:before:inset-x-0",
      className
    )}
    {...props}
  />
);

export { ResizableGroup, ResizablePanel, ResizableHandle };
