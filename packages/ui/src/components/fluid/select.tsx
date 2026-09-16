"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import * as SelectPrimitive from "@radix-ui/react-select";
import type { IconComponent } from "../../fluid/lib/icon-context";
import { cn } from "../../lib/utils";
import { bevel } from "../../fluid/lib/bevel";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import { useShape, usePopupShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { Elevated } from "../../fluid/lib/elevated";
import {
  popupMotionClass,
  popupScrollAreaClass,
  popupViewportClass,
  isDisabledRow,
} from "../../fluid/lib/popup";
import { useKeyboardNavGate } from "../../fluid/hooks/use-keyboard-nav-gate";
import { ScrollArea } from "../../components/fluid/scroll-area";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

const selectionAckMs = 300;

interface SelectContextValue {
  value: string;
  open: boolean;
  unmount: () => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select compound components must be inside <Select>");
  return ctx;
}

interface SelectContentContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  checkedIndex?: number;
}

const SelectContentContext =
  createContext<SelectContentContextValue | null>(null);

interface SelectProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  size?: SizeVariant;
}

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  name,
  required,
  size,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [radixOpen, setRadixOpen] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;

  const lastPickRef = useRef(0);
  const ackTimeoutRef = useRef<number | null>(null);
  const cancelAckClose = useCallback(() => {
    if (ackTimeoutRef.current !== null) {
      clearTimeout(ackTimeoutRef.current);
      ackTimeoutRef.current = null;
    }
  }, []);
  useEffect(() => cancelAckClose, [cancelAckClose]);

  const handleValueChange = useCallback(
    (next: string) => {
      lastPickRef.current = performance.now();
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [value, onValueChange]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && performance.now() - lastPickRef.current < 100) {
        cancelAckClose();
        ackTimeoutRef.current = window.setTimeout(() => {
          ackTimeoutRef.current = null;
          setOpen(false);
        }, selectionAckMs);
        return;
      }
      cancelAckClose();
      setOpen(nextOpen);
      if (nextOpen) setRadixOpen(true);
      // Closing: radixOpen is released by SelectContent once the exit
      // animation completes (onAnimationComplete or the timeout fallback).
    },
    [cancelAckClose]
  );

  const unmount = useCallback(() => setRadixOpen(false), []);

  const ctx = useMemo(
    () => ({ value: currentValue, open, unmount }),
    [currentValue, open, unmount]
  );

  const root = (
    <SelectContext.Provider value={ctx}>
      <SelectPrimitive.Root
        value={currentValue}
        onValueChange={handleValueChange}
        open={radixOpen}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        name={name}
        required={required}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );

  return size ? <SizeProvider size={size}>{root}</SizeProvider> : root;
}

Select.displayName = "Select";

const triggerVariants = cva(
  [
    "group inline-flex items-center justify-between outline-none cursor-pointer",
    "transition-all duration-80",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
    bevel,
  ],
  {
    variants: {
      variant: {
        bordered:
          "border border-border bg-transparent text-foreground hover:bg-hover",
        borderless:
          "border border-transparent bg-transparent text-foreground hover:bg-hover",
      },
    },
    defaultVariants: {
      variant: "bordered",
    },
  }
);

interface SelectTriggerProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof triggerVariants> {
  icon?: IconComponent;
  placeholder?: string;
  error?: string;
  size?: SizeVariant;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      className,
      variant,
      icon: Icon,
      placeholder = "Select…",
      error,
      size,
      ...props
    },
    ref
  ) => {
    const shape = useShape();
    const sizeClasses = useSize(size);
    const compact = sizeClasses.variant === "compact";

    return (
      <div className="flex flex-col gap-1">
        <SelectPrimitive.Trigger
          ref={ref}
          aria-invalid={!!error || undefined}
          className={cn(
            triggerVariants({ variant }),
            sizeClasses.control,
            sizeClasses.text,
            sizeClasses.px,
            sizeClasses.gap,
            compact ? "min-w-[128px]" : "min-w-[160px]",
            shape.input,
            error && "border-destructive/50 hover:border-destructive/50",
            className
          )}
          {...props}
        >
          <span className={cn("flex items-center min-w-0 flex-1", sizeClasses.gap)}>
            {Icon && (
              <Icon
                size={sizeClasses.icon}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground transition-[color,stroke-width] duration-80 group-hover:text-foreground group-hover:stroke-[2]"
              />
            )}
            <span className="min-w-0 flex-1 text-left truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1 group-data-[placeholder]:text-muted-foreground">
              <SelectPrimitive.Value placeholder={placeholder} />
            </span>
          </span>

          <SelectPrimitive.Icon asChild>
            <svg
              width={sizeClasses.icon}
              height={sizeClasses.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted-foreground transition-colors duration-80 group-hover:text-foreground"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        {error && (
          <span className="text-[12px] text-destructive pl-3">{error}</span>
        )}
      </div>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

interface SelectContentProps {
  className?: string;
  children: ReactNode;
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children }, ref) => {
    const { open, value, unmount } = useSelectContext();
    const shape = usePopupShape();
    const containerRef = useRef<HTMLDivElement>(null);

    const hover = useFluidHover(containerRef, { isItemDisabled: isDisabledRow });
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      isMeasured,
      handlers,
      registerItem,
      remeasure,
    } = hover;

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const { keyboardNavRef, trackKeyboardNav } = useKeyboardNavGate(open);
    const [checkedIndex, setCheckedIndex] = useState<number | undefined>(
      undefined
    );

    useEffect(() => {
      if (open) return;
      const id = setTimeout(() => unmount(), exitFallbackMs(spring.fast));
      return () => clearTimeout(id);
    }, [open, unmount]);

    useEffect(() => {
      if (!open) return;
      remeasure();
    }, [open, remeasure]);

    useEffect(() => {
      if (!open) return;
      let inner: number;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          const container = containerRef.current;
          if (container) {
            const items = Array.from(
              container.querySelectorAll("[data-fluid-hover-index]")
            ) as HTMLElement[];
            const idx = items.findIndex(
              (el) => el.getAttribute("data-value") === value
            );
            setCheckedIndex(idx !== -1 ? idx : undefined);
          }
        });
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }, [open, value]);

    useEffect(() => {
      if (open) return;
      setCheckedIndex(undefined);
      setActiveIndex(null);
      setFocusedIndex(null);
    }, [open, setActiveIndex]);

    const checkedRect =
      isMeasured && checkedIndex != null ? itemRects[checkedIndex] : null;
    const focusRect =
      isMeasured && focusedIndex !== null ? itemRects[focusedIndex] : null;

    const contentCtx = useMemo(
      () => ({ registerItem, activeIndex, checkedIndex }),
      [registerItem, activeIndex, checkedIndex]
    );

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-50"
        >
          <motion.div
            className={popupMotionClass}
            initial={{ opacity: 0, y: "var(--popup-enter-y)", scaleY: 0.96 }}
            animate={
              open
                ? { opacity: 1, y: 0, scaleY: 1 }
                : { opacity: 0, y: "var(--popup-enter-y)", scaleY: 0.96 }
            }
            transition={open ? spring.fast : spring.fast.exit}
            onAnimationComplete={() => {
              if (!open) unmount();
            }}
          >
            <SelectContentContext.Provider value={contentCtx}>
              <SelectPrimitive.Viewport asChild>
                <Elevated
                  offset={2}
                  shadowLevel={3}
                  ref={ref}
                  onKeyDownCapture={trackKeyboardNav}
                  onMouseEnter={() => {
                    handlers.onMouseEnter();
                    setFocusedIndex(null);
                  }}
                  onMouseMove={handlers.onMouseMove}
                  onMouseLeave={handlers.onMouseLeave}
                  onClick={handlers.onClick}
                  onFocus={(e) => {
                    const indexAttr = (e.target as HTMLElement)
                      .closest("[data-fluid-hover-index]")
                      ?.getAttribute("data-fluid-hover-index");
                    if (indexAttr != null) {
                      const idx = Number(indexAttr);
                      setActiveIndex(idx);
                      setFocusedIndex(
                        keyboardNavRef.current &&
                          (e.target as HTMLElement).matches(":focus-visible")
                          ? idx
                          : null
                      );
                    }
                  }}
                  onBlur={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node))
                      return;
                    setFocusedIndex(null);
                    setActiveIndex(null);
                  }}
                  className={cn(
                    `flex flex-col min-w-[var(--radix-select-trigger-width)] max-h-[min(300px,var(--radix-select-content-available-height))] overflow-hidden ${shape.container} select-none outline-none`,
                    className
                  )}
                >
                  <ScrollArea className={popupScrollAreaClass} viewportClassName={cn(popupViewportClass, "scroll-fade")}>
                    <div
                      ref={containerRef}
                      className="relative flex flex-col p-1"
                    >
                  {open && (
                    <AnimatePresence>
                      {checkedRect && (
                        <motion.div
                          className={`absolute ${shape.bg} bg-active pointer-events-none`}
                          initial={false}
                          animate={{
                            top: checkedRect.top,
                            left: checkedRect.left,
                            width: checkedRect.width,
                            height: checkedRect.height,
                            opacity: 1,
                          }}
                          exit={{ opacity: 0, transition: spring.moderate.exit }}
                          transition={{
                            ...spring.moderate,
                            opacity: { duration: 0.08 },
                          }}
                        />
                      )}
                    </AnimatePresence>
                  )}

                  <FluidHoverHighlight
                    hover={hover}
                    hidden={!open}
                    className={shape.bg}
                  />

                  {open && (
                    <AnimatePresence>
                      {focusRect && (
                        <motion.div
                          className={`absolute ${shape.focusRing} pointer-events-none z-20 border border-[color:var(--focus-ring,#6B97FF)]`}
                          initial={false}
                          animate={{
                            left: focusRect.left - 2,
                            top: focusRect.top - 2,
                            width: focusRect.width + 4,
                            height: focusRect.height + 4,
                          }}
                          exit={{ opacity: 0, transition: spring.fast.exit }}
                          transition={{
                            ...spring.fast,
                            opacity: { duration: 0.08 },
                          }}
                        />
                      )}
                    </AnimatePresence>
                  )}

                  {children}
                    </div>
                  </ScrollArea>
                </Elevated>
              </SelectPrimitive.Viewport>
            </SelectContentContext.Provider>
          </motion.div>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);

SelectContent.displayName = "SelectContent";

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconComponent;
  index: number;
  value: string;
  disabled?: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  (
    {
      className,
      children,
      icon: Icon,
      value,
      index,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const selectCtx = useSelectContext();
    const contentCtx = useContext(SelectContentContext);
    const internalRef = useRef<HTMLDivElement>(null);
    const shape = usePopupShape();
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const hasMounted = useRef(false);

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    const registerItem = contentCtx?.registerItem;
    useRegisterFluidHoverItem(registerItem, index, internalRef);

    const isActive = contentCtx?.activeIndex === index;
    const isChecked = selectCtx.value === value;
    const skipAnimation = !hasMounted.current;

    return (
      <SelectPrimitive.Item
        value={value}
        disabled={disabled}
        textValue={typeof children === "string" ? children : undefined}
        ref={(node: HTMLDivElement | null) => {
          (
            internalRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        data-fluid-hover-index={index}
        data-value={value}
        className={cn(
          `relative z-10 flex ${sizeClasses.control} shrink-0 items-center ${sizeClasses.gap} ${shape.item} ${sizeClasses.itemPx} ${sizeClasses.text} cursor-pointer outline-none select-none`,
          "transition-[color] duration-80",
          isActive || isChecked
            ? "text-foreground"
            : "text-muted-foreground",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            size={sizeClasses.icon}
            strokeWidth={isActive || isChecked ? 2 : 1.5}
            className="shrink-0 transition-[color,stroke-width] duration-80"
          />
        )}

        <span className="flex-1 min-w-0 truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1">
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </span>

        <span
          aria-hidden
          className={cn("shrink-0", compact ? "w-3.5 h-3.5" : "w-4 h-4")}
        >
          <AnimatePresence>
            {isChecked && (
              <motion.svg
                key="check"
                width={sizeClasses.icon}
                height={sizeClasses.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
              >
                <motion.path
                  d="M4 12L9 17L20 6"
                  initial={{ pathLength: skipAnimation ? 1 : 0 }}
                  animate={{
                    pathLength: 1,
                    transition: { duration: 0.08, ease: "easeOut" },
                  }}
                  exit={{
                    pathLength: 0,
                    transition: { duration: 0.04, ease: "easeIn" },
                  }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
      </SelectPrimitive.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";

function SelectGroup({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="group" className={className} {...props}>
      {children}
    </div>
  );
}

SelectGroup.displayName = "SelectGroup";

const SelectLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const compact = useSize().variant === "compact";
    return (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 shrink-0 text-muted-foreground",
        compact ? "text-[11px]" : "text-[12px]",
        className
      )}
      {...props}
    />
    );
  }
);

SelectLabel.displayName = "SelectLabel";

const SelectSeparator = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("my-1 -mx-1 h-px shrink-0 bg-border/60", className)}
    {...props}
  />
));

SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  triggerVariants,
};

export type { SelectProps, SelectTriggerProps, SelectContentProps, SelectItemProps };
