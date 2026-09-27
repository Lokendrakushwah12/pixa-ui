"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
} from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";
import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";

const ToggleGroupSizeContext = createContext<SizeVariant | undefined>(undefined);

type ToggleGroupProps = Omit<
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>,
  "value" | "defaultValue" | "onValueChange"
> & {
  size?: SizeVariant;
  /** Radix's spelling; Base UI is always multi-value underneath. */
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: ((value: string) => void) | ((value: string[]) => void);
};

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      size,
      className,
      children,
      type = "single",
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const multiple = type === "multiple";
    const toArray = (v: string | string[] | undefined) =>
      v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : [];
    const valueProps = {
      value: toArray(value),
      defaultValue: toArray(defaultValue),
      onValueChange: onValueChange
        ? (next: string[]) =>
            multiple
              ? (onValueChange as (v: string[]) => void)(next)
              : (onValueChange as (v: string) => void)(next[0] ?? "")
        : undefined,
      toggleMultiple: multiple,
    };
    const shape = useShape();
    const sizeClasses = useSize(size);

    return (
      <ToggleGroupSizeContext.Provider value={size}>
        <ToggleGroupPrimitive
          ref={ref}
          data-slot="toggle-group"
          className={cn(
            "inline-flex items-center border border-border bg-muted",
            sizeClasses.segmentPad,
            shape.container,
            className
          )}
          {...valueProps}
          {...(props as ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>)}
        >
          {children}
        </ToggleGroupPrimitive>
      </ToggleGroupSizeContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof Toggle>
>(({ className, children, ...props }, ref) => {
  const size = useContext(ToggleGroupSizeContext);
  const sizeClasses = useSize(size);
  const shape = useShape();

  return (
    <Toggle
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-medium",
        "transition-colors duration-100 outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "text-muted-foreground hover:text-foreground",
        "data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-surface-2",
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
    </Toggle>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps };
