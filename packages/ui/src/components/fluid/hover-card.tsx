"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { PreviewCard as HoverCardPrimitive } from "@base-ui/react/preview-card";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useShape } from "../../fluid/lib/shape-context";
import { popupMotionClass } from "../../fluid/lib/popup";
import { SurfaceProvider, useSurface } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

const HOVER_CARD_OFFSET = 2;

const HoverCardOpenContext = createContext(false);
const HoverCardDelayContext = createContext({ openDelay: 200, closeDelay: 150 });

function HoverCardTrigger(props: HoverCardPrimitive.Trigger.Props) {
  const { openDelay, closeDelay } = useContext(HoverCardDelayContext);
  return (
    <HoverCardPrimitive.Trigger
      closeDelay={closeDelay}
      delay={openDelay}
      {...props}
    />
  );
}

interface HoverCardProps
  extends Omit<HoverCardPrimitive.Root.Props, "onOpenChange"> {
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

function HoverCard({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  openDelay = 200,
  closeDelay = 150,
  ...props
}: HoverCardProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <HoverCardOpenContext.Provider value={open}>
      <HoverCardDelayContext.Provider value={{ openDelay, closeDelay }}>
        <HoverCardPrimitive.Root
          open={open}
          onOpenChange={handleOpenChange}
          {...props}
        >
          {children}
        </HoverCardPrimitive.Root>
      </HoverCardDelayContext.Provider>
    </HoverCardOpenContext.Provider>
  );
}

type HoverCardContentProps = ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Popup
> & {
  align?: ComponentPropsWithoutRef<
    typeof HoverCardPrimitive.Positioner
  >["align"];
  sideOffset?: number;
};

const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, children, align = "center", sideOffset = 6, ...props }, ref) => {
  const open = useContext(HoverCardOpenContext);
  const shape = useShape();
  const substrate = useSurface();
  const level = Math.min(substrate + HOVER_CARD_OFFSET, 8);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => setMounted(false), exitFallbackMs(spring.moderate));
    return () => clearTimeout(id);
  }, [open]);

  if (!mounted) return null;

  return (
    <HoverCardPrimitive.Portal keepMounted>
      <HoverCardPrimitive.Positioner
        align={align}
        className="z-50"
        sideOffset={sideOffset}
      >
      <HoverCardPrimitive.Popup
        ref={ref}
        data-slot="hover-card-content"
        render={<div />}
        {...props}
      >
        <motion.div
          className={cn(
            "z-50 w-64 border border-border p-3 focus:outline-none",
            popupMotionClass,
            surfaceClasses(level),
            shape.container,
            className
          )}
          initial={{ opacity: 0, scale: 0.97, y: "var(--popup-enter-y)" }}
          animate={{
            opacity: open ? 1 : 0,
            scale: open ? 1 : 0.97,
            y: open ? 0 : "var(--popup-enter-y)",
          }}
          transition={open ? spring.moderate : spring.moderate.exit}
          onAnimationComplete={() => {
            if (!open) setMounted(false);
          }}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </HoverCardPrimitive.Popup>
      </HoverCardPrimitive.Positioner>
    </HoverCardPrimitive.Portal>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
