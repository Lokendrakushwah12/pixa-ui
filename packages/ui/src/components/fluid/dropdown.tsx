"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  cloneElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useFluidHover } from "../../fluid/hooks/use-fluid-hover";
import {
  useMergeSplitBlocks,
  useSelectionRuns,
  SelectionBackgrounds,
} from "../../fluid/hooks/use-merge-split";
import { usePopupShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { Elevated } from "../../fluid/lib/elevated";
import {
  popupMotionClass,
  popupScrollAreaClass,
  popupViewportClass,
  isDisabledRow,
} from "../../fluid/lib/popup";
import { ScrollArea } from "../../components/fluid/scroll-area";
import {
  DropdownSearch,
  DropdownEmpty,
  DropdownSearchHostContext,
  useDropdownSearchHost,
  type DropdownSearchProps,
} from "../../components/fluid/dropdown-search";
import {
  DropdownContext,
  useDropdown,
  useDropdownMaybe,
  type DropdownContextValue,
  type MenuItemRenderOptions,
} from "../../components/fluid/menu-item";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

export { useDropdown, useDropdownMaybe };
export type { DropdownContextValue, MenuItemRenderOptions };

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  checkedIndex?: number;
  checkedIndices?: number[];
  size?: SizeVariant;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, checkedIndex, checkedIndices, size, className, ...props }, ref) => {
    const shape = usePopupShape();
    const containerRef = useRef<HTMLDivElement>(null);
    const hover = useFluidHover(containerRef, { isItemDisabled: isDisabledRow });
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      handlers,
      registerItem,
    } = hover;

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const multiple = checkedIndices != null;
    const checkedRect =
      !multiple && checkedIndex != null ? itemRects[checkedIndex] : null;
    const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
    const runs = useSelectionRuns(checkedIndices ?? []);
    const blocks = useMergeSplitBlocks(runs, itemRects, shape.bgRadius);
    const panelCtx = useMemo(
      () => ({ registerItem, activeIndex, checkedIndex, multiple, checkedIndices }),
      [registerItem, activeIndex, checkedIndex, multiple, checkedIndices]
    );
    const panel = (
      <DropdownContext.Provider value={panelCtx}>
        <Elevated
          offset={2}
          shadowLevel={3}
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
              containerRef.current?.querySelectorAll(
                '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]'
              ) ?? []
            ) as HTMLElement[];
            const currentIdx = items.indexOf(e.target as HTMLElement);
            if (currentIdx === -1) return;

            if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) {
              e.preventDefault();
              const next = ["ArrowDown", "ArrowRight"].includes(e.key)
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
            `relative flex flex-col w-72 max-w-full  p-1 select-none`,
            className
          )}
          {...props}
        >
          {multiple && <SelectionBackgrounds blocks={blocks} />}

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

          <FluidHoverHighlight
            hover={hover}
            from={checkedRect}
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
        </Elevated>
      </DropdownContext.Provider>
    );

    return size ? <SizeProvider size={size}>{panel}</SizeProvider> : panel;
  }
);

Dropdown.displayName = "Dropdown";

interface DropdownMenuContextValue {
  open: boolean;
  disabled: boolean;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx)
    throw new Error(
      "DropdownMenu compound components must be inside <DropdownMenu>"
    );
  return ctx;
}

interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: SizeVariant;
}

function DropdownMenu({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  size,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  const ctx = useMemo(() => ({ open, disabled }), [open, disabled]);

  const root = (
    <DropdownMenuContext.Provider value={ctx}>
      <MenuPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        modal={false}
      >
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuContext.Provider>
  );

  return size ? <SizeProvider size={size}>{root}</SizeProvider> : root;
}

DropdownMenu.displayName = "DropdownMenu";

interface DropdownTriggerProps
  extends Omit<
    ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>,
    "asChild"
  > {
  render?: ReactElement;
}

const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ render, children, disabled, ...props }, ref) => {
    const { disabled: rootDisabled } = useDropdownMenuContext();
    const isDisabled = disabled || rootDisabled;

    if (render) {
      return (
        <MenuPrimitive.Trigger
          ref={ref}
          render={render}
          disabled={isDisabled}
          {...props}
        />
      );
    }
    return (
      <MenuPrimitive.Trigger ref={ref} disabled={isDisabled} {...props}>
        {children}
      </MenuPrimitive.Trigger>
    );
  }
);

DropdownTrigger.displayName = "DropdownTrigger";

type PositionerProps = ComponentPropsWithoutRef<
  typeof MenuPrimitive.Positioner
>;

interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  checkedIndex?: number;
  checkedIndices?: number[];
  side?: PositionerProps["side"];
  align?: PositionerProps["align"];
  sideOffset?: number;
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  (
    {
      className,
      children,
      checkedIndex,
      checkedIndices,
      side = "bottom",
      align = "start",
      sideOffset = 6,
    },
    ref
  ) => {
    const { open } = useDropdownMenuContext();
    const shape = usePopupShape();
    const containerRef = useRef<HTMLDivElement>(null);

    const hover = useFluidHover(containerRef, { isItemDisabled: isDisabledRow });
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      handlers,
      registerItem,
      remeasure,
    } = hover;

    const {
      host: searchHost,
      hasSearch,
      searchMounted,
      onKeyDownCapture: redirectTypingToSearch,
      isSearchField,
      highlightFirst,
    } = useDropdownSearchHost(open, { containerRef, setActiveIndex });

    useEffect(() => {
      if (!open) return;
      let inner: number | undefined;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          if (hasSearch()) return;
          const container = containerRef.current;
          if (!container || container.contains(document.activeElement) && document.activeElement !== container) return;
          const first = container.querySelector<HTMLElement>(
            '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"])'
          );
          first?.focus();
        });
      });
      return () => {
        cancelAnimationFrame(outer);
        if (inner !== undefined) cancelAnimationFrame(inner);
      };
    }, [open, hasSearch]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      if (open) setMounted(true);
    }, [open]);

    useEffect(() => {
      if (open) return;
      const id = setTimeout(() => setMounted(false), exitFallbackMs(spring.fast));
      return () => clearTimeout(id);
    }, [open]);

    useEffect(() => {
      if (!open || !mounted) return;
      remeasure();
    }, [open, mounted, remeasure]);

    const multiple = checkedIndices != null;
    const checkedRect =
      !multiple && checkedIndex != null ? itemRects[checkedIndex] : null;
    const runs = useSelectionRuns(checkedIndices ?? []);
    const blocks = useMergeSplitBlocks(runs, open ? itemRects : [], shape.bgRadius);
    const renderMenuItem = useCallback(
      ({
        radio,
        checkbox,
        checked,
        value,
        disabled,
        label,
        closeOnClick,
        element,
        children,
      }: MenuItemRenderOptions) => {
        const commonProps = {
          disabled,
          label,
          closeOnClick,
          render: element,
        };
        if (checkbox) {
          return (
            <MenuPrimitive.CheckboxItem checked={!!checked} {...commonProps}>
              {children}
            </MenuPrimitive.CheckboxItem>
          );
        }
        return radio ? (
          <MenuPrimitive.RadioItem value={String(value)} {...commonProps}>
            {children}
          </MenuPrimitive.RadioItem>
        ) : (
          <MenuPrimitive.Item {...commonProps}>{children}</MenuPrimitive.Item>
        );
      },
      []
    );

    const contentCtx = useMemo(
      () => ({
        registerItem,
        activeIndex,
        checkedIndex,
        multiple,
        checkedIndices,
        inMenu: true,
        renderMenuItem,
      }),
      [registerItem, activeIndex, checkedIndex, multiple, checkedIndices, renderMenuItem]
    );

    if (!mounted) return null;

    return (
      <MenuPrimitive.Portal keepMounted>
        <MenuPrimitive.Positioner
          className="z-50"
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          <MenuPrimitive.Popup
            className={cn("z-50 outline-none", popupMotionClass)}
            render={
              <motion.div
                initial={{ opacity: 0, y: "var(--popup-enter-y)", scaleY: 0.96 }}
                animate={
                  open
                    ? { opacity: 1, y: 0, scaleY: 1 }
                    : { opacity: 0, y: "var(--popup-enter-y)", scaleY: 0.96 }
                }
                transition={open ? spring.fast : spring.fast.exit}
                onAnimationComplete={() => {
                  if (!open) setMounted(false);
                }}
              />
            }
          >
            <DropdownContext.Provider value={contentCtx}>
            <DropdownSearchHostContext.Provider value={searchHost}>
              <Elevated
                offset={2}
                shadowLevel={3}
                ref={ref}
                onKeyDownCapture={redirectTypingToSearch}
                onMouseEnter={handlers.onMouseEnter}
                onMouseMove={handlers.onMouseMove}
                onClick={handlers.onClick}
                onMouseLeave={() => {
                  handlers.onMouseLeave();
                  if (isSearchField(document.activeElement)) highlightFirst();
                }}
                onFocus={(e) => {
                  const indexAttr = (e.target as HTMLElement)
                    .closest("[data-fluid-hover-index]")
                    ?.getAttribute("data-fluid-hover-index");
                  if (indexAttr != null) {
                    setActiveIndex(Number(indexAttr));
                  } else if (isSearchField(e.target)) {
                    highlightFirst();
                  } else if (e.target !== e.currentTarget) {
                    setActiveIndex(null);
                  }
                }}
                onBlur={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node))
                    return;
                  setActiveIndex(null);
                }}
                className={cn(
                  `flex flex-col w-72 max-w-full min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(480px,var(--radix-dropdown-menu-content-available-height))] overflow-hidden ${shape.container} select-none outline-none`,
                  className
                )}
              >
                <ScrollArea className={popupScrollAreaClass} viewportClassName={cn(popupViewportClass, !searchMounted && "scroll-fade")}>
                  <div
                    ref={containerRef}
                    className="relative flex flex-col p-1"
                  >
                {multiple && <SelectionBackgrounds blocks={blocks} />}

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

                <FluidHoverHighlight
                  hover={hover}
                  from={checkedRect}
                  className={shape.bg}
                />

                <MenuPrimitive.RadioGroup
                  value={checkedIndex != null ? String(checkedIndex) : undefined}
                  className="contents"
                >
                  {children}
                </MenuPrimitive.RadioGroup>
                  </div>
                </ScrollArea>
              </Elevated>
            </DropdownSearchHostContext.Provider>
            </DropdownContext.Provider>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    );
  }
);

DropdownContent.displayName = "DropdownContent";

const DropdownLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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

DropdownLabel.displayName = "DropdownLabel";

const DropdownSeparator = forwardRef<
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

DropdownSeparator.displayName = "DropdownSeparator";

export {
  Dropdown,
  DropdownLabel,
  DropdownSeparator,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownSearch,
  DropdownEmpty,
};
export type {
  DropdownProps,
  DropdownMenuProps,
  DropdownTriggerProps,
  DropdownContentProps,
  DropdownSearchProps,
};
export default Dropdown;
