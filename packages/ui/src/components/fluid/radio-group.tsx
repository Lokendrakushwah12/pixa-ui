"use client";

import {
  Children,
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import { useShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

interface RadioGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  selectedIndex: number | null;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  hasSelection: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("useRadioGroup must be used within a RadioGroup");
  return ctx;
}

interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  children: ReactNode;
  selectedIndex?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  size?: SizeVariant;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, selectedIndex, value, onValueChange, size, className, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const childValues = Children.toArray(children)
      .filter(isValidElement)
      .map((child) => (child.props as { value?: string }).value);
    const hover = useFluidHover(containerRef);
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      handlers,
      registerItem,
    } = hover;

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const resolvedSelectedIndex =
      value !== undefined
        ? childValues.findIndex((childValue) => childValue === value)
        : selectedIndex ?? -1;
    const hasSelection =
      resolvedSelectedIndex >= 0 ||
      Children.toArray(children)
        .filter(isValidElement)
        .some((child) => (child.props as { selected?: boolean }).selected === true);

    const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
    const selectedRect =
      resolvedSelectedIndex >= 0 ? itemRects[resolvedSelectedIndex] : null;
    const shape = useShape();

    const content = (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onMouseEnter={handlers.onMouseEnter}
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
              (e.target as HTMLElement).matches(":focus-visible") ? idx : null
            );
          }
        }}
        onBlur={(e) => {
          if (containerRef.current?.contains(e.relatedTarget as Node)) return;
          setFocusedIndex(null);
          setActiveIndex(null);
        }}
        onKeyDown={(e) => {
          const items = Array.from(
            containerRef.current?.querySelectorAll("[data-fluid-hover-index]") ?? []
          ) as HTMLElement[];
          const currentIdx = items.indexOf(e.target as HTMLElement);
          if (currentIdx === -1) return;

          if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            const next = ["ArrowDown", "ArrowRight"].includes(e.key)
              ? (currentIdx + 1) % items.length
              : (currentIdx - 1 + items.length) % items.length;
            items[next].focus();
            items[next].click();
          } else if (e.key === "Home") {
            e.preventDefault();
            items[0]?.focus();
            items[0]?.click();
          } else if (e.key === "End") {
            e.preventDefault();
            items[items.length - 1]?.focus();
            items[items.length - 1]?.click();
          }
        }}
        role="radiogroup"
        className={cn(
          "relative flex flex-col w-72 max-w-full select-none",
          className
        )}
        {...props}
      >
        {selectedRect && (
          <motion.div
            className={`absolute ${shape.bg} bg-active pointer-events-none`}
            initial={false}
            animate={{
              top: selectedRect.top,
              left: selectedRect.left,
              width: selectedRect.width,
              height: selectedRect.height,
              opacity: 1,
            }}
            transition={{
              ...spring.moderate,
              opacity: { duration: 0.08 },
            }}
          />
        )}

        <FluidHoverHighlight
          hover={hover}
          className={shape.bg}
        />

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

        {children}
      </div>
    );

    const withSize = (node: ReactNode) =>
      size ? <SizeProvider size={size}>{node}</SizeProvider> : node;

    if (value !== undefined) {
      return withSize(
        <RadioGroupContext.Provider
          value={{
            registerItem,
            activeIndex,
            selectedIndex: resolvedSelectedIndex >= 0 ? resolvedSelectedIndex : null,
            selectedValue: value,
            onValueChange,
            hasSelection,
          }}
        >
          <RadioGroupPrimitive.Root
            value={value}
            onValueChange={(v) => onValueChange?.(v)}
            asChild
          >
            {content}
          </RadioGroupPrimitive.Root>
        </RadioGroupContext.Provider>
      );
    }

    return withSize(
      <RadioGroupContext.Provider
        value={{
          registerItem,
          activeIndex,
          selectedIndex: selectedIndex ?? null,
          hasSelection,
        }}
      >
        {content}
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

interface RadioItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  index: number;
  selected?: boolean;
  onSelect?: () => void;
  value?: string;
}

const RadioItem = forwardRef<HTMLDivElement, RadioItemProps>(
  ({ label, index, selected, onSelect, value, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);
    const {
      registerItem,
      activeIndex,
      selectedIndex,
      selectedValue,
      onValueChange,
      hasSelection,
    } = useRadioGroupContext();

    useRegisterFluidHoverItem(registerItem, index, internalRef);

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    const isActive = activeIndex === index;
    const skipAnimation = !hasMounted.current;
    const shape = useShape();
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const isSelected =
      value !== undefined && selectedValue !== undefined
        ? selectedValue === value
        : selected ?? selectedIndex === index;

    const handleSelect = () => {
      if (value !== undefined) {
        onValueChange?.(value);
      }
      onSelect?.();
    };

    return (
      <div
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-fluid-hover-index={index}
        tabIndex={isSelected ? 0 : !hasSelection && index === 0 ? 0 : -1}
        role="radio"
        aria-checked={isSelected}
        aria-label={label}
        onClick={handleSelect}
        onMouseDown={(e) => {
          const interactive = (e.target as HTMLElement).closest(
            'button:not([tabindex="-1"]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (interactive && interactive !== e.currentTarget) return;
          e.preventDefault();
          e.currentTarget.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleSelect();
          }
        }}
        className={cn(
          `relative z-10 flex ${sizeClasses.control} items-center ${sizeClasses.gap} ${shape.item} ${sizeClasses.px} cursor-pointer outline-none`,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "relative shrink-0",
            compact ? "w-[14px] h-[14px]" : "w-[16px] h-[16px]"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full border-solid transition-all duration-80",
              isSelected
                ? "border-[1.5px] border-transparent"
                : isActive
                ? "border-[1.5px] border-neutral-400 dark:border-neutral-500"
                : "border-[1.5px] border-border"
            )}
          />
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{
                  opacity: skipAnimation ? 1 : 0,
                  scale: skipAnimation ? 1 : 0.3,
                }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.04 } }}
                transition={spring.fast}
              >
                <div
                  className={cn(
                    "rounded-full bg-foreground",
                    compact ? "w-[7px] h-[7px]" : "w-[8px] h-[8px]"
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className={cn("inline-grid", sizeClasses.text)}>
          <span
            className="col-start-1 row-start-1 invisible [text-box:trim-both_cap_alphabetic]"
            style={{ fontVariationSettings: fontWeights.semibold }}
            aria-hidden="true"
          >
            {label}
          </span>
          <span
            className={cn(
              "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80 [text-box:trim-both_cap_alphabetic]",
              isSelected || isActive
                ? "text-foreground"
                : "text-muted-foreground"
            )}
            style={{
              fontVariationSettings: isSelected
                ? fontWeights.semibold
                : fontWeights.normal,
            }}
          >
            {label}
          </span>
        </span>

        {value !== undefined && (
          <RadioGroupPrimitive.Item
            value={value}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          />
        )}
      </div>
    );
  }
);

RadioItem.displayName = "RadioItem";

export { RadioGroup, RadioItem };
export default RadioGroup;
