"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { withAsChild } from "../../fluid/shared/as-child";
import { cn } from "../../lib/utils";

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = withAsChild(
  CollapsiblePrimitive.Trigger,
  "CollapsibleTrigger"
);

const CollapsibleContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    data-slot="collapsible-content"
    className={cn(
      "overflow-hidden",
      "data-open:animate-collapsible-down data-closed:animate-collapsible-up",
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Panel>
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
