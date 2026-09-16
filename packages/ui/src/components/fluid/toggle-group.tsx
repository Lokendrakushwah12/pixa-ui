"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
} from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";

const ToggleGroupSizeContext = createContext<SizeVariant | undefined>(undefined);

type ToggleGroupProps = (
  | ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
) & { size?: SizeVariant };

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ size, className, children, ...props }, ref) => {
    const shape = useShape();
    const sizeClasses = useSize(size);

    return (
      <ToggleGroupSizeContext.Provider value={size}>
        <ToggleGroupPrimitive.Root
          ref={ref}
          data-slot="toggle-group"
          className={cn(
            "inline-flex items-center border border-border bg-muted",
            sizeClasses.segmentPad,
            shape.container,
            className
          )}
          {...(props as ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>)}
        >
          {children}
        </ToggleGroupPrimitive.Root>
      </ToggleGroupSizeContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const size = useContext(ToggleGroupSizeContext);
  const sizeClasses = useSize(size);
  const shape = useShape();

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-medium",
        "transition-colors duration-100 outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "text-muted-foreground hover:text-foreground",
        "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-surface-2",
        sizeClasses.segmentItem,
        sizeClasses.px,
        sizeClasses.text,
        sizeClasses.gap,
        "[&>svg]:size-4",
        shape.item,
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps };
