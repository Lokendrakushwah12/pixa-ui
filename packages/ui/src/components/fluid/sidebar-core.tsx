"use client";

import {
  createElement,
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  useId,
  forwardRef,
  cloneElement,
  isValidElement,
  Children,
  type ReactNode,
  type ReactElement,
  type ElementType,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, useSizeVariant } from "../../fluid/lib/size-context";
import { useIcon } from "../../fluid/lib/icon-context";
import { useSurface, SurfaceProvider } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";
import { Button, type ButtonProps } from "../../components/fluid/button";
import { Tooltip } from "../../components/fluid/tooltip";

export const SIDEBAR_COOKIE_NAME = "sidebar_state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "[";
export const SIDEBAR_KEYBOARD_SHORTCUT_RIGHT = "]";
export const SIDEBAR_MIN_WIDTH = 160;
export const SIDEBAR_MAX_WIDTH = 360;
export const SIDEBAR_COLLAPSE_SLOP = 56;

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "none";

export interface SidebarContextValue {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  width: string;
  setWidth: (width: string) => void;
  widthMobile: string;
  mobileBreakpoint: number;
  side: SidebarSide;
  registerSide: (side: SidebarSide) => void;
  shortcut: string | null;
  peek: "hover" | "click" | "none";
  isPeeking: boolean;
  setIsPeeking: React.Dispatch<React.SetStateAction<boolean>>;
  schedulePeek: () => void;
  scheduleDismissPeek: () => void;
  cancelPeekTimer: () => void;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
}

const mountedProviders: HTMLElement[] = [];

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}

function useIsMobile(breakpoint: number): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);
  return !!isMobile;
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  persist?: boolean;
  shortcut?: string | null;
  mobileBreakpoint?: number;
  peek?: "hover" | "click" | "none";
  width?: string;
  widthMobile?: string;
}

const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      persist = true,
      shortcut: shortcutProp,
      mobileBreakpoint = 768,
      peek = "none",
      width: widthProp = SIDEBAR_WIDTH,
      widthMobile = SIDEBAR_WIDTH_MOBILE,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile(mobileBreakpoint);
    const [openMobile, setOpenMobile] = useState(false);
    const [side, setSide] = useState<SidebarSide>("left");
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;
      mountedProviders.push(el);
      return () => {
        const i = mountedProviders.indexOf(el);
        if (i !== -1) mountedProviders.splice(i, 1);
      };
    }, []);
    const registerSide = useCallback((next: SidebarSide) => setSide(next), []);

    const [width, setWidth] = useState(widthProp);
    useEffect(() => setWidth(widthProp), [widthProp]);
    const [isResizing, setIsResizing] = useState(false);

    const shortcut =
      shortcutProp === undefined
        ? side === "right"
          ? SIDEBAR_KEYBOARD_SHORTCUT_RIGHT
          : SIDEBAR_KEYBOARD_SHORTCUT
        : shortcutProp;

    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = openProp ?? internalOpen;
    const openRef = useRef(open);
    openRef.current = open;

    const setOpen = useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const next = typeof value === "function" ? value(openRef.current) : value;
        if (onOpenChange) onOpenChange(next);
        else setInternalOpen(next);
        if (persist) {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      },
      [onOpenChange, persist]
    );

    const toggleSidebar = useCallback(() => {
      if (isMobile) setOpenMobile((prev) => !prev);
      else setOpen((prev) => !prev);
    }, [isMobile, setOpen]);

    const [isPeeking, setIsPeeking] = useState(false);
    const peekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
      if (open || peek === "none") {
        if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
        peekTimerRef.current = null;
        setIsPeeking(false);
      }
    }, [open, peek]);
    const cancelPeekTimer = useCallback(() => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      peekTimerRef.current = null;
    }, []);
    const schedulePeek = useCallback(() => {
      cancelPeekTimer();
      peekTimerRef.current = setTimeout(() => setIsPeeking(true), 150);
    }, [cancelPeekTimer]);
    const scheduleDismissPeek = useCallback(() => {
      cancelPeekTimer();
      peekTimerRef.current = setTimeout(() => setIsPeeking(false), 250);
    }, [cancelPeekTimer]);
    useEffect(() => cancelPeekTimer, [cancelPeekTimer]);

    useEffect(() => {
      if (shortcut == null) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() !== shortcut.toLowerCase()) return;
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable
        )
          return;
        const root = wrapperRef.current;
        if (!root) return;
        if (root.contains(target)) {
          if (
            mountedProviders.some(
              (el) => el !== root && root.contains(el) && el.contains(target)
            )
          )
            return;
          if (mountedProviders.some((el) => el !== root && target.contains(el)))
            return;
        } else {
          const wrapped = mountedProviders.filter((el) => target.contains(el));
          if (wrapped.length > 0) {
            const outermost = wrapped.find(
              (el) => !wrapped.some((other) => other !== el && other.contains(el))
            );
            if (outermost !== root) return;
          } else {
            if (mountedProviders.some((el) => el !== root && el.contains(target)))
              return;
            const outermost = mountedProviders.find(
              (el) =>
                !mountedProviders.some((other) => other !== el && other.contains(el))
            );
            if (outermost !== root) return;
          }
        }
        event.preventDefault();
        toggleSidebar();
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [shortcut, toggleSidebar]);

    const value = useMemo<SidebarContextValue>(
      () => ({
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
        width,
        setWidth,
        widthMobile,
        mobileBreakpoint,
        side,
        registerSide,
        shortcut,
        peek,
        isPeeking,
        setIsPeeking,
        schedulePeek,
        scheduleDismissPeek,
        cancelPeekTimer,
        isResizing,
        setIsResizing,
      }),
      [
        open,
        setOpen,
        openMobile,
        isMobile,
        toggleSidebar,
        width,
        widthMobile,
        mobileBreakpoint,
        side,
        registerSide,
        shortcut,
        peek,
        isPeeking,
        schedulePeek,
        scheduleDismissPeek,
        cancelPeekTimer,
        isResizing,
      ]
    );

    return (
      <SidebarContext.Provider value={value}>
        <div
          ref={(node) => {
            wrapperRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          data-slot="sidebar-wrapper"
          className={cn("group/sidebar-wrapper relative flex min-h-svh w-full", className)}
          style={
            {
              "--sidebar-width": width,
              "--sidebar-width-mobile": widthMobile,
              ...style,
            } as CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

type SlotProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

function composeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === "function") r(node);
      else if (r) (r as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export function resolveSlotTemplate(
  render: ReactElement | undefined,
  asChild: boolean | undefined,
  children: ReactNode
): { template: ReactElement<SlotProps> | null; content: ReactNode } {
  if (render && isValidElement(render)) {
    return { template: render as ReactElement<SlotProps>, content: children };
  }
  if (asChild) {
    const only = Children.toArray(children)[0];
    if (isValidElement(only)) {
      return {
        template: only as ReactElement<SlotProps>,
        content: (only.props as SlotProps).children,
      };
    }
  }
  return { template: null, content: children };
}

export function slotElement(
  template: ReactElement<SlotProps> | null,
  DefaultTag: ElementType,
  props: SlotProps & { ref?: Ref<HTMLElement> },
  content: ReactNode
): ReactElement {
  if (!template) {
    // ElementType spans intrinsics whose children type is `never`, so build the
    // element rather than writing it as JSX.
    return createElement(DefaultTag, props, content);
  }
  const templateProps = template.props;
  const merged: SlotProps & { ref?: Ref<HTMLElement> } = {
    ...props,
    ...templateProps,
    className: cn(props.className, templateProps.className),
    style: { ...props.style, ...(templateProps.style as CSSProperties | undefined) },
  };
  for (const key of Object.keys(props)) {
    if (!/^on[A-Z]/.test(key)) continue;
    const ours = props[key];
    const theirs = templateProps[key];
    if (typeof ours === "function" && typeof theirs === "function") {
      merged[key] = (...args: unknown[]) => {
        (theirs as (...a: unknown[]) => void)(...args);
        (ours as (...a: unknown[]) => void)(...args);
      };
    }
  }
  const templateRef =
    (templateProps as { ref?: Ref<HTMLElement> }).ref ??
    (template as unknown as { ref?: Ref<HTMLElement> }).ref;
  merged.ref = composeRefs(props.ref, templateRef);
  return cloneElement(template, merged, content);
}

const BREAKPOINT_FADE_BASE =
  "transition-[opacity,display] ease-out [transition-behavior:allow-discrete] motion-reduce:transition-none";
const BREAKPOINT_HIDDEN: Record<number, string> = {
  640: "max-sm:hidden max-sm:opacity-0 max-sm:duration-160 sm:duration-240 sm:starting:opacity-0",
  768: "max-md:hidden max-md:opacity-0 max-md:duration-160 md:duration-240 md:starting:opacity-0",
  1024: "max-lg:hidden max-lg:opacity-0 max-lg:duration-160 lg:duration-240 lg:starting:opacity-0",
  1280: "max-xl:hidden max-xl:opacity-0 max-xl:duration-160 xl:duration-240 xl:starting:opacity-0",
};

type MotionSafeDivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export interface SidebarShellProps extends MotionSafeDivProps {
  side: SidebarSide;
  variant: SidebarVariant;
  bordered?: boolean;
  rail?: boolean;
  railTooltipOpen?: boolean;
}

const SidebarShell = forwardRef<HTMLDivElement, SidebarShellProps>(
  ({ side, variant, bordered = true, rail = true, railTooltipOpen, className, children, ...props }, ref) => {
    const {
      open,
      width,
      mobileBreakpoint,
      isMobile,
      isResizing,
      peek,
      isPeeking,
      setIsPeeking,
      schedulePeek,
      scheduleDismissPeek,
      cancelPeekTimer,
    } = useSidebar();
    const shape = useShape();
    const shellRef = useRef<HTMLDivElement | null>(null);

    const peekEnabled = peek !== "none" && !open && !isResizing;
    useEffect(() => {
      if (!(peekEnabled && isPeeking)) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setIsPeeking(false);
      };
      const onPointerDown = (event: PointerEvent) => {
        if (!shellRef.current?.contains(event.target as Node)) setIsPeeking(false);
      };
      let wasInside = true;
      const onPointerMove = (event: PointerEvent) => {
        const overlay =
          shellRef.current?.querySelector('[data-sidebar="peek"]') ?? shellRef.current;
        if (!overlay) return;
        const box = overlay.getBoundingClientRect();
        const inside =
          event.clientX >= box.left - 8 &&
          event.clientX <= box.right + 8 &&
          event.clientY >= box.top - 8 &&
          event.clientY <= box.bottom + 8;
        if (inside) {
          wasInside = true;
          cancelPeekTimer();
        } else if (wasInside) {
          wasInside = false;
          scheduleDismissPeek();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("pointerdown", onPointerDown);
      if (peek === "hover") document.addEventListener("pointermove", onPointerMove);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("pointermove", onPointerMove);
      };
    }, [peekEnabled, isPeeking, setIsPeeking, peek, cancelPeekTimer, scheduleDismissPeek]);
    const substrate = useSurface();
    const floatingLevel = Math.min(substrate + 1, 8);
    const reduceMotion = useReducedMotion() ?? false;
    const [dragFlip, setDragFlip] = useState(false);
    const prevOpenRef = useRef(open);
    const openFlipped = prevOpenRef.current !== open;
    const [pinFromPeekHold, setPinFromPeekHold] = useState(false);
    const pinnedFromPeek = (openFlipped && open && isPeeking) || pinFromPeekHold;
    useEffect(() => {
      if (!(open && isPeeking)) return;
      setPinFromPeekHold(true);
      const id = setTimeout(() => setPinFromPeekHold(false), exitFallbackMs(spring.slow));
      return () => clearTimeout(id);
    }, [open, isPeeking]);
    useEffect(() => {
      const flipped = prevOpenRef.current !== open;
      prevOpenRef.current = open;
      if (!isResizing) {
        setDragFlip(false);
        return;
      }
      if (!flipped) return;
      setDragFlip(true);
      const id = setTimeout(() => setDragFlip(false), exitFallbackMs(spring.moderate));
      return () => clearTimeout(id);
    }, [open, isResizing]);
    const widthTransition = reduceMotion
      ? { duration: 0 }
      : isResizing
        ? openFlipped || dragFlip
          ? open
            ? spring.moderate
            : spring.moderate.exit
          : { duration: 0 }
        : open
          ? spring.slow
          : spring.slow.exit;

    return (
      <motion.div
        ref={(node: HTMLDivElement | null) => {
          shellRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-slot="sidebar"
        data-state={open ? "expanded" : "collapsed"}
        data-collapsible={open ? "" : "offcanvas"}
        data-variant={variant}
        data-side={side}
        className={cn(
          "peer shrink-0 sticky top-0 h-svh",
          peekEnabled || pinnedFromPeek ? "z-40" : "overflow-hidden",
          side === "right" && "order-last",
          variant === "inset" && "[--scroll-divider-inset:8px]",
          BREAKPOINT_FADE_BASE,
          BREAKPOINT_HIDDEN[mobileBreakpoint],
          !BREAKPOINT_HIDDEN[mobileBreakpoint] && isMobile && "hidden",
          className
        )}
        initial={false}
        animate={{ width: open ? width : "0rem" }}
        transition={widthTransition}
        onPointerEnter={peekEnabled && peek === "hover" ? cancelPeekTimer : undefined}
        onPointerLeave={
          peekEnabled && peek === "hover"
            ? () => {
                if (!isPeeking) cancelPeekTimer();
              }
            : undefined
        }
        {...props}
      >
        {peekEnabled ? (
          <>
            <button
              type="button"
              aria-label="Peek sidebar"
              aria-expanded={isPeeking}
              className={cn(
                "group/peek-strip absolute inset-y-0 z-40 w-3 cursor-pointer outline-none",
                side === "left" ? "left-0" : "right-0"
              )}
              onPointerEnter={
                peek === "hover"
                  ? (event) => {
                      if (event.pointerType === "mouse") schedulePeek();
                    }
                  : undefined
              }
              onClick={() => {
                cancelPeekTimer();
                setIsPeeking(true);
              }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-0 w-px bg-border opacity-0 transition-opacity duration-80 group-hover/peek-strip:opacity-100 group-focus-visible/peek-strip:opacity-100",
                  side === "left" ? "left-0" : "right-0"
                )}
              />
            </button>
            <AnimatePresence>
              {isPeeking && (
                <motion.div
                  data-sidebar="peek"
                  className={cn(
                    "absolute inset-y-2 z-50 flex flex-col overflow-hidden",
                    side === "left"
                      ? variant === "floating"
                        ? "left-2"
                        : "left-0"
                      : variant === "floating"
                        ? "right-2"
                        : "right-0",
                    shape.container,
                    surfaceClasses(floatingLevel, 3)
                  )}
                  style={{
                    width: `calc(${width} - ${variant === "floating" ? "1rem" : "0.5rem"})`,
                  }}
                  initial={reduceMotion ? false : { x: side === "left" ? "-108%" : "108%" }}
                  animate={{ x: 0 }}
                  exit={{
                    x: side === "left" ? "-108%" : "108%",
                    transition: reduceMotion ? { duration: 0 } : spring.moderate.exit,
                  }}
                  transition={reduceMotion ? { duration: 0 } : spring.moderate}
                >
                  <SurfaceProvider value={floatingLevel}>{children}</SurfaceProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
        <motion.div
          className={cn(
            "absolute inset-y-0 flex h-full flex-col",
            side === "left" ? "left-0" : "right-0",
            variant === "floating" && "p-2",
            variant === "inset" && "py-2"
          )}
          style={{ width }}
          initial={false}
          animate={{ x: open ? "0%" : side === "left" ? "-100%" : "100%" }}
          transition={widthTransition}
        >
          {variant === "floating" ? (
            <div
              data-sidebar="sidebar"
              className={cn(
                "flex h-full w-full min-h-0 flex-col",
                shape.container,
                surfaceClasses(floatingLevel, 3)
              )}
            >
              <SurfaceProvider value={floatingLevel}>{children}</SurfaceProvider>
            </div>
          ) : (
            <div
              data-sidebar="sidebar"
              className={cn(
                "flex h-full w-full min-h-0 flex-col",
                bordered &&
                  variant === "sidebar" &&
                  (side === "left" ? "border-r border-border" : "border-l border-border")
              )}
            >
              {children}
            </div>
          )}
          {rail && (
          <SidebarRail
            tooltipOpen={railTooltipOpen}
            className={cn(
              variant === "floating" &&
                (side === "left" ? "right-1 after:right-[3.5px]" : "left-1 after:left-[3.5px]"),
              variant !== "sidebar" &&
                "after:inset-y-2 after:[mask-image:linear-gradient(to_bottom,transparent_var(--rail-fade-start),black_var(--rail-fade-end),black_calc(100%-var(--rail-fade-end)),transparent_calc(100%-var(--rail-fade-start)))]"
            )}
            style={
              variant !== "sidebar"
                ? ({
                    "--rail-fade-start": `${shape.bgRadius >= 20 ? 24 : 12}px`,
                    "--rail-fade-end": `${(shape.bgRadius >= 20 ? 24 : 12) + 24}px`,
                  } as CSSProperties)
                : undefined
            }
          />
          )}
        </motion.div>
        )}
      </motion.div>
    );
  }
);
SidebarShell.displayName = "SidebarShell";

export type SidebarTriggerProps = ButtonProps;

function ShortcutKbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="-my-1 flex h-4 min-w-4 items-center justify-center rounded border border-background/30 px-1 font-sans text-[10px] text-background/80">
      {children}
    </kbd>
  );
}

function useShortcutKey(): string {
  const { side, shortcut } = useSidebar();
  return (
    shortcut ??
    (side === "right" ? SIDEBAR_KEYBOARD_SHORTCUT_RIGHT : SIDEBAR_KEYBOARD_SHORTCUT)
  );
}

const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ onClick, size, children, ...props }, ref) => {
    const {
      toggleSidebar,
      open,
      openMobile,
      isMobile,
      side,
      peek,
      isPeeking,
      schedulePeek,
      cancelPeekTimer,
    } = useSidebar();
    const shortcutKey = useShortcutKey();
    const hoverPeek = peek === "hover" && !isMobile && !open;
    const PanelLeftIcon = useIcon("panel-left");
    const PanelRightIcon = useIcon("panel-right");
    const TriggerIcon = side === "right" ? PanelRightIcon : PanelLeftIcon;
    const iconSize = useSizeVariant() === "compact" ? ("icon-compact" as const) : ("icon" as const);
    const collapsed = isMobile ? !openMobile : !open;

    return (
      <Tooltip
        side="bottom"
        content={
          <span className="flex items-center gap-1.5">
            <span className="[text-box:trim-both_cap_alphabetic]">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
            <ShortcutKbd>{shortcutKey}</ShortcutKbd>
          </span>
        }
      >
        <Button
          ref={ref}
          variant="ghost"
          size={size ?? iconSize}
          data-sidebar="trigger"
          aria-label="Toggle Sidebar"
          onClick={(event) => {
            onClick?.(event);
            toggleSidebar();
          }}
          onPointerEnter={
            hoverPeek
              ? (event: React.PointerEvent) => {
                  if (event.pointerType !== "mouse") return;
                  if (isPeeking) cancelPeekTimer();
                  else schedulePeek();
                }
              : undefined
          }
          onPointerLeave={
            hoverPeek
              ? () => {
                  if (!isPeeking) cancelPeekTimer();
                }
              : undefined
          }
          {...props}
        >
          {children ?? <TriggerIcon />}
        </Button>
      </Tooltip>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";

export interface SidebarRailProps extends HTMLAttributes<HTMLButtonElement> {
  tooltipOpen?: boolean;
}

const SidebarRail = forwardRef<HTMLButtonElement, SidebarRailProps>(
  ({ className, tooltipOpen, ...props }, ref) => {
    const { toggleSidebar, setOpen, setWidth, side, setIsResizing } = useSidebar();
    const shortcutKey = useShortcutKey();
    const railRef = useRef<HTMLButtonElement | null>(null);
    const dragRef = useRef<{ startX: number; startWidth: number; moved: boolean; collapsed: boolean } | null>(null);
    const [dragging, setDragging] = useState(false);

    const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      const panel = railRef.current?.closest('[data-slot="sidebar"]') as HTMLElement | null;
      if (!panel) return;
      dragRef.current = { startX: event.clientX, startWidth: panel.offsetWidth, moved: false, collapsed: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(dx) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        setDragging(true);
        setIsResizing(true);
      }
      const delta = side === "left" ? dx : -dx;
      const raw = drag.startWidth + delta;
      if (raw < SIDEBAR_MIN_WIDTH - SIDEBAR_COLLAPSE_SLOP) {
        if (!drag.collapsed) {
          drag.collapsed = true;
          setWidth(`${SIDEBAR_MIN_WIDTH}px`);
          setOpen(false);
        }
        return;
      }
      if (drag.collapsed) {
        drag.collapsed = false;
        setOpen(true);
      }
      const next = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, raw));
      setWidth(`${next}px`);
    };

    const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
      setDragging(false);
      setIsResizing(false);
      if (drag && !drag.moved) toggleSidebar();
    };

    const onPointerCancel = () => {
      dragRef.current = null;
      setDragging(false);
      setIsResizing(false);
    };

    const semibold = { fontVariationSettings: fontWeights.semibold };

    return (
      <Tooltip
        side={side === "left" ? "right" : "left"}
        sideOffset={8}
        followCursor="y"
        forceOpen={dragging ? false : tooltipOpen}
        content={
          <span className="flex flex-col items-start gap-2">
            <span className="[text-box:trim-both_cap_alphabetic]">
              <span style={semibold}>Drag</span> to resize
            </span>
            <span className="flex items-center gap-1.5">
              <span className="[text-box:trim-both_cap_alphabetic]">
                <span style={semibold}>Click</span> to collapse
              </span>
              <ShortcutKbd>{shortcutKey}</ShortcutKbd>
            </span>
          </span>
        }
      >
        <button
          ref={(node) => {
            railRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }}
          type="button"
          data-sidebar="rail"
          aria-label="Resize or collapse sidebar"
          tabIndex={-1}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className={cn(
            "absolute inset-y-0 z-20 w-2 cursor-col-resize touch-none outline-none",
            side === "left" ? "right-0" : "left-0",
            "after:absolute after:inset-y-0 after:w-px after:bg-transparent hover:after:bg-foreground/25 after:transition-colors after:duration-80",
            tooltipOpen && "after:bg-foreground/25",
            side === "left" ? "after:right-0" : "after:left-0",
            className
          )}
          {...props}
        />
      </Tooltip>
    );
  }
);
SidebarRail.displayName = "SidebarRail";

export type SidebarInsetProps = HTMLAttributes<HTMLElement>;

const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => {
    const shape = useShape();
    return (
      <main
        ref={ref}
        data-slot="sidebar-inset"
        className={cn(
          "relative flex min-h-0 w-full min-w-0 flex-1 flex-col bg-background",
          "peer-data-[variant=inset]:m-2 peer-data-[variant=inset]:peer-data-[side=left]:ml-0 peer-data-[variant=inset]:peer-data-[side=right]:mr-0",
          "peer-data-[variant=inset]:peer-data-[state=collapsed]:peer-data-[side=left]:ml-2 peer-data-[variant=inset]:peer-data-[state=collapsed]:peer-data-[side=right]:mr-2",
          "transition-[margin] duration-80",
          shape.bgRadius >= 20
            ? "peer-data-[variant=inset]:rounded-3xl"
            : "peer-data-[variant=inset]:rounded-xl",
          "peer-data-[variant=inset]:bg-surface-2 peer-data-[variant=inset]:shadow-surface-2",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = "SidebarInset";

export type SidebarInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SidebarInput = forwardRef<HTMLInputElement, SidebarInputProps>(
  ({ className, ...props }, ref) => {
    const shape = useShape();
    const size = useSize();
    return (
      <input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "w-full bg-transparent px-3 text-foreground placeholder:text-muted-foreground outline-none",
          "ring-1 ring-transparent transition-[background-color,box-shadow] duration-80",
          "hover:bg-muted/50 hover:ring-border",
          "focus:bg-card focus:ring-border",
          "focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
          size.variant === "compact" ? "h-7" : "h-8",
          size.text,
          shape.input,
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInput.displayName = "SidebarInput";

export type SidebarSectionProps = HTMLAttributes<HTMLDivElement>;

const SidebarHeader = forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex shrink-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  )
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="separator"
      role="separator"
      aria-orientation="horizontal"
      className={cn("mx-2 h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
);
SidebarSeparator.displayName = "SidebarSeparator";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface SidebarGroupContextValue {
  open: boolean;
  toggle: () => void;
  contentId: string;
  actionsCount: number;
}

const SidebarGroupContext = createContext<SidebarGroupContextValue | null>(null);

export interface SidebarGroupProps extends SidebarSectionProps {
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  (
    {
      className,
      collapsible = false,
      open: openProp,
      defaultOpen = true,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const contentId = useId();
    const toggle = useCallback(() => {
      const next = !(openProp ?? uncontrolledOpen);
      setUncontrolledOpen(next);
      onOpenChange?.(next);
    }, [openProp, uncontrolledOpen, onOpenChange]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    useIsoLayoutEffect(() => {
      if (!collapsible) return;
      const el = contentRef.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      const measure = () => setContentHeight(el.offsetHeight);
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [collapsible]);
    const measured = contentHeight !== null;
    const [settled, setSettled] = useState(open);
    useEffect(() => {
      if (!open) setSettled(false);
    }, [open]);

    const prevOpenRef = useRef(open);
    const togglingRef = useRef(false);
    if (prevOpenRef.current !== open) {
      prevOpenRef.current = open;
      togglingRef.current = true;
    }

    const isHeaderAction = (k: ReactNode) =>
      isValidElement(k) &&
      (k.type === SidebarGroupAction || k.type === SidebarGroupActions);
    let inner: ReactNode = children;
    let actionsCount = 0;
    if (collapsible) {
      const kids = Children.toArray(children);
      const labelIdx = kids.findIndex(
        (k) => isValidElement(k) && k.type === SidebarGroupLabel
      );
      if (labelIdx !== -1) {
        const tail = kids.slice(labelIdx + 1);
        const headerActions = tail.filter(isHeaderAction);
        const rest = tail.filter((k) => !isHeaderAction(k));
        actionsCount = headerActions.reduce<number>(
          (n, k) =>
            n +
            (isValidElement(k) && k.type === SidebarGroupActions
              ? Children.count(
                  (k.props as { children?: ReactNode }).children
                )
              : 1),
          0
        );
        inner = (
          <>
            {kids.slice(0, labelIdx)}
            <div className="group/group-header w-full">
              {kids[labelIdx]}
              {headerActions}
            </div>
            <motion.div
              id={contentId}
              aria-hidden={open ? undefined : true}
              className={cn(
                open && settled ? "overflow-visible" : "overflow-hidden",
                !measured && !open && "h-0"
              )}
              initial={false}
              animate={
                measured
                  ? { height: open ? contentHeight : 0, opacity: open ? 1 : 0 }
                  : { opacity: open ? 1 : 0 }
              }
              transition={
                togglingRef.current
                  ? open
                    ? spring.moderate
                    : spring.moderate.exit
                  : { duration: 0 }
              }
              onAnimationComplete={() => {
                togglingRef.current = false;
                if (open) setSettled(true);
              }}
            >
              <div ref={contentRef} className="flex w-full min-w-0 flex-col">
                {rest}
              </div>
            </motion.div>
          </>
        );
      }
    }

    const ctx = useMemo(
      () => ({ open, toggle, contentId, actionsCount }),
      [open, toggle, contentId, actionsCount]
    );

    return (
      <div
        ref={ref}
        data-sidebar="group"
        data-state={collapsible ? (open ? "open" : "closed") : undefined}
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
        {...props}
      >
        <SidebarGroupContext.Provider value={collapsible ? ctx : null}>
          {inner}
        </SidebarGroupContext.Provider>
      </div>
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";

export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  render?: ReactElement;
  asChild?: boolean;
}

const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, render, asChild, children, ...props }, ref) => {
    const sizeVariant = useSizeVariant();
    const sizeClasses = useSize();
    const group = useContext(SidebarGroupContext);
    const shape = useShape();
    const ChevronRightIcon = useIcon("chevron-right");
    const { template, content } = resolveSlotTemplate(render, asChild, children);

    const nodes = Children.toArray(content);
    let textEnd = 0;
    while (
      textEnd < nodes.length &&
      (typeof nodes[textEnd] === "string" || typeof nodes[textEnd] === "number")
    ) {
      textEnd++;
    }
    const leadingText = nodes.slice(0, textEnd).join("");
    const labelContent = leadingText ? (
      <>
        <span className="min-w-0 truncate">{leadingText}</span>
        {nodes.slice(textEnd)}
      </>
    ) : (
      content
    );

    if (group) {
      return slotElement(
        template,
        "button",
        {
          ref: ref as Ref<HTMLElement>,
          type: template ? undefined : "button",
          "data-sidebar": "group-label",
          "aria-expanded": group.open,
          "aria-controls": group.contentId,
          onClick: group.toggle,
          style:
            group.actionsCount > 0
              ? ({ "--group-actions-pad": `${group.actionsCount * 28 + 6}px` } as CSSProperties)
              : undefined,
          className: cn(
            "flex h-8 w-full shrink-0 cursor-pointer select-none items-center gap-2 px-2 text-left text-muted-foreground/70 outline-none",
            "transition-colors duration-80 hover:text-muted-foreground",
            group.actionsCount > 0 && "pr-[var(--group-actions-pad)]",
            "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
            shape.item,
            sizeVariant === "compact" ? "text-[11px]" : "text-[12px]",
            className
          ),
          ...props,
        },
        <>
          {labelContent}
          <span
            className={cn(
              "ml-auto flex h-6 shrink-0 items-center justify-center overflow-hidden",
              group.open
                ? "w-0 opacity-0 group-hover/group-header:w-6 group-hover/group-header:opacity-100 group-focus-within/group-header:w-6 group-focus-within/group-header:opacity-100 group-has-[[data-sidebar=group-action]:is([data-state=open],[data-popup-open],[aria-expanded=true])]/group-header:w-6 group-has-[[data-sidebar=group-action]:is([data-state=open],[data-popup-open],[aria-expanded=true])]/group-header:opacity-100 pointer-coarse:w-6 pointer-coarse:opacity-100"
                : "w-6 opacity-100"
            )}
          >
            <motion.span
              className="inline-flex"
              animate={{ rotate: group.open ? 90 : 0 }}
              transition={spring.fast}
            >
              <ChevronRightIcon
                size={sizeClasses.icon}
                strokeWidth={1.5}
                className="shrink-0"
              />
            </motion.span>
          </span>
        </>
      );
    }

    return slotElement(
      template,
      "div",
      {
        ref: ref as Ref<HTMLElement>,
        "data-sidebar": "group-label",
        className: cn(
          "flex h-8 shrink-0 items-center gap-2 px-2 text-muted-foreground/70 outline-none",
          sizeVariant === "compact" ? "text-[11px]" : "text-[12px]",
          className
        ),
        ...props,
      },
      labelContent
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarGroupActionProps extends HTMLAttributes<HTMLButtonElement> {
  render?: ReactElement;
  asChild?: boolean;
}

const GroupActionsContext = createContext(false);

const SidebarGroupAction = forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
  ({ className, render, asChild, children, ...props }, ref) => {
    const shape = useShape();
    const sizeClasses = useSize();
    const inCluster = useContext(GroupActionsContext);
    const { template, content } = resolveSlotTemplate(render, asChild, children);
    return slotElement(
      template,
      "button",
      {
        ref: ref as Ref<HTMLElement>,
        type: template ? undefined : "button",
        "data-sidebar": "group-action",
        className: cn(
          inCluster
            ? "relative flex size-6 items-center justify-center text-muted-foreground outline-none"
            : "absolute right-3.5 top-3 flex size-6 items-center justify-center text-muted-foreground outline-none",
          "hover:bg-hover hover:text-foreground transition-colors duration-80",
          "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
          "[&_svg]:size-[var(--icon-size)] [&_svg]:shrink-0 [&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 hover:[&_svg]:stroke-[2]",
          shape.item,
          className
        ),
        ...props,
        style: {
          ...({ "--icon-size": `${sizeClasses.icon}px` } as CSSProperties),
          ...(props.style ?? {}),
        },
      },
      content
    );
  }
);
SidebarGroupAction.displayName = "SidebarGroupAction";

export type SidebarGroupActionsProps = HTMLAttributes<HTMLDivElement>;

const SidebarGroupActions = forwardRef<HTMLDivElement, SidebarGroupActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group-actions"
        className={cn(
          "absolute right-3.5 top-2 z-10 flex h-8 items-center gap-1",
          className
        )}
        {...props}
      >
        <GroupActionsContext.Provider value={true}>
          {children}
        </GroupActionsContext.Provider>
      </div>
    );
  }
);
SidebarGroupActions.displayName = "SidebarGroupActions";

const SidebarGroupContent = forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full", className)}
      {...props}
    />
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";

export {
  SidebarProvider,
  SidebarShell,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupActions,
  SidebarGroupContent,
};
