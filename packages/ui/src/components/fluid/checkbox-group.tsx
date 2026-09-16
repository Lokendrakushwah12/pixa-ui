"use client";

import {
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import { useMergeSplitBlocks, SelectionBackgrounds } from "../../fluid/hooks/use-merge-split";
import { useShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

interface CheckboxGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null
);

function useCheckboxGroup() {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx)
    throw new Error("useCheckboxGroup must be used within a CheckboxGroup");
  return ctx;
}

interface CheckboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  checkedIndices: Set<number>;
  size?: SizeVariant;
}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ children, checkedIndices, size, className, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupIdCounter = useRef(0);
    const prevGroupMap = useRef(new Map<number, number>());

    const hover = useFluidHover(containerRef);
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      handlers,
      registerItem,
    } = hover;

    const runs: { start: number; end: number }[] = [];
    const sortedChecked = [...checkedIndices].sort((a, b) => a - b);
    for (const idx of sortedChecked) {
      const last = runs[runs.length - 1];
      if (last && idx === last.end + 1) {
        last.end = idx;
      } else {
        runs.push({ start: idx, end: idx });
      }
    }

    const usedIds = new Set<number>();
    const newGroupMap = new Map<number, number>();
    const checkedGroups = runs.map((run) => {
      let stableId: number | null = null;
      for (let i = run.start; i <= run.end; i++) {
        const prevId = prevGroupMap.current.get(i);
        if (prevId !== undefined && !usedIds.has(prevId)) {
          stableId = prevId;
          break;
        }
      }
      const id = stableId ?? ++groupIdCounter.current;
      usedIds.add(id);
      for (let i = run.start; i <= run.end; i++) {
        newGroupMap.set(i, id);
      }
      return { ...run, id };
    });
    prevGroupMap.current = newGroupMap;

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
    const shape = useShape();

    const blocks = useMergeSplitBlocks(checkedGroups, itemRects, shape.mergedRadius);

    const group = (
      <CheckboxGroupContext.Provider value={{ registerItem, activeIndex }}>
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

            if (["ArrowDown", "ArrowUp"].includes(e.key)) {
              e.preventDefault();
              const next = e.key === "ArrowDown"
                ? (currentIdx + 1) % items.length
                : (currentIdx - 1 + items.length) % items.length;
              items[next].focus();
            } else if (e.key === "Home") {
              e.preventDefault();
              items[0]?.focus();
            } else if (e.key === "End") {
              e.preventDefault();
              items[items.length - 1]?.focus();
            }
          }}
          role="group"
          className={cn(
            "relative flex flex-col w-72 max-w-full select-none",
            className
          )}
          {...props}
        >
          <SelectionBackgrounds blocks={blocks} />

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
      </CheckboxGroupContext.Provider>
    );

    return size ? <SizeProvider size={size}>{group}</SizeProvider> : group;
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

interface CheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  index: number;
  checked: boolean;
  onToggle: () => void;
}

const CheckboxItem = forwardRef<HTMLDivElement, CheckboxItemProps>(
  ({ label, index, checked, onToggle, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);
    const { registerItem, activeIndex } = useCheckboxGroup();

    useRegisterFluidHoverItem(registerItem, index, internalRef);

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    const isActive = activeIndex === index;
    const skipAnimation = !hasMounted.current;
    const shape = useShape();
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";

    return (
      <div
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-fluid-hover-index={index}
        tabIndex={0}
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
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
            onToggle();
          }
        }}
        className={cn(
          `relative z-10 flex ${sizeClasses.control} items-center ${sizeClasses.gap} ${shape.item} ${sizeClasses.px} cursor-pointer outline-none`,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Root
          checked={checked}
          onCheckedChange={() => onToggle()}
          tabIndex={-1}
          aria-hidden
          className={cn(
            "relative shrink-0 appearance-none bg-transparent p-0 border-0 outline-none cursor-pointer",
            compact ? "w-[14px] h-[14px]" : "w-[16px] h-[16px]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              "absolute inset-0 border-solid transition-all duration-80",
              compact ? "rounded-[4px]" : "rounded-[5px]",
              checked
                ? "border-[1.5px] border-transparent"
                : isActive
                ? "border-[1.5px] border-neutral-400 dark:border-neutral-500"
                : "border-[1.5px] border-border"
            )}
          />
          <AnimatePresence>
            {checked && (
              <CheckboxPrimitive.Indicator forceMount asChild>
                <motion.svg
                  width={compact ? 16 : 18}
                  height={compact ? 16 : 18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                >
                  <motion.path
                    d="M6 12L10 16L18 8"
                    initial={{
                      pathLength: skipAnimation ? 1 : 0,
                    }}
                    animate={{
                      pathLength: 1,
                      transition: {
                        duration: 0.08,
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      pathLength: 0,
                      transition: {
                        duration: 0.04,
                        ease: "easeIn",
                      },
                    }}
                  />
                </motion.svg>
              </CheckboxPrimitive.Indicator>
            )}
          </AnimatePresence>
        </CheckboxPrimitive.Root>

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
              checked || isActive
                ? "text-foreground"
                : "text-muted-foreground"
            )}
            style={{
              fontVariationSettings: checked
                ? fontWeights.semibold
                : fontWeights.normal,
            }}
          >
            {label}
          </span>
        </span>
      </div>
    );
  }
);

CheckboxItem.displayName = "CheckboxItem";

export { CheckboxGroup, CheckboxItem };
export default CheckboxGroup;
