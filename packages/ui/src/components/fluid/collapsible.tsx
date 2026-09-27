"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "../../lib/utils";

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const CollapsibleContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    data-slot="collapsible-content"
    className={cn(
      "overflow-hidden",
      "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Panel>
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
