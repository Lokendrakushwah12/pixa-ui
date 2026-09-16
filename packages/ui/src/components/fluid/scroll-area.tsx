"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";
import { useTouchPrimary } from "../../fluid/hooks/use-touch-primary";

const ScrollAreaContext = createContext<boolean>(false);

const ScrollbarVisibleContext = createContext<boolean>(true);

const SCROLL_LINGER_MS = 600;

type Orientation = "vertical" | "horizontal" | "both";

interface ScrollAreaProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  viewportClassName?: string;
  orientation?: Orientation;
}

const ScrollArea = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      scrollHideDelay: _scrollHideDelay,
      viewportClassName,
      orientation = "vertical",
      ...props
    },
    ref
  ) => {
    const isTouch = useTouchPrimary();

    const [hovering, setHovering] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(
      () => () => {
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      },
      []
    );
    const handleScroll = () => {
      setScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setScrolling(false), SCROLL_LINGER_MS);
    };

    return (
      <ScrollAreaContext.Provider value={isTouch}>
        {isTouch ? (
          <div
            ref={ref}
            role="group"
            data-slot="scroll-area"
            aria-roledescription="scroll area"
            className={cn("relative overflow-hidden", className)}
            {...props}
          >
            <div
              data-slot="scroll-area-viewport"
              className={cn(
                "size-full rounded-[inherit]",
                orientation === "vertical" && "overflow-y-auto",
                orientation === "horizontal" && "overflow-x-auto",
                orientation === "both" && "overflow-auto",
                viewportClassName
              )}
              tabIndex={0}
            >
              {children}
            </div>
          </div>
        ) : (
          <ScrollbarVisibleContext.Provider value={hovering || scrolling}>
            <ScrollAreaPrimitive.Root
              ref={ref}
              data-slot="scroll-area"
              type="always"
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={() => setHovering(false)}
              className={cn("relative overflow-hidden", className)}
              {...props}
            >
              <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                onScroll={handleScroll}
                className={cn("size-full rounded-[inherit]", viewportClassName)}
              >
                {children}
              </ScrollAreaPrimitive.Viewport>
              {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
              {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
              {orientation === "both" && <ScrollAreaPrimitive.Corner />}
            </ScrollAreaPrimitive.Root>
          </ScrollbarVisibleContext.Provider>
        )}
      </ScrollAreaContext.Provider>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

const ScrollBar = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => {
  const isTouch = useContext(ScrollAreaContext);
  const visible = useContext(ScrollbarVisibleContext);
  const shape = useShape();

  if (isTouch) return null;

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      data-slot="scroll-area-scrollbar"
      data-visible={visible ? "" : undefined}
      className={cn(
        "group/scrollbar z-20 flex touch-none select-none",
        "opacity-0 transition-opacity duration-120 ease-out delay-160",
        "data-[visible]:opacity-100 data-[visible]:duration-160 data-[visible]:delay-0",
        "pointer-events-none data-[visible]:pointer-events-auto",
        orientation === "vertical" && "h-full w-2.5",
        orientation === "horizontal" && "h-2.5 w-full flex-col",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative bg-[rgb(var(--overlay)/0.08)] transition-[background-color,width,height] duration-160 ease-in-out",
          "group-hover/scrollbar:bg-[rgb(var(--overlay)/0.12)] active:!bg-[rgb(var(--overlay)/0.16)]",
          shape.bg,
          orientation === "vertical" &&
            "mx-auto my-1 w-1 -translate-x-0.5 group-hover/scrollbar:w-1.5",
          orientation === "horizontal" &&
            "my-auto mx-1 h-1 -translate-y-0.5 group-hover/scrollbar:h-1.5"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
export type { ScrollAreaProps };
