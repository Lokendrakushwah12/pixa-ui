"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useShape } from "../../fluid/lib/shape-context";
import { popupMotionClass } from "../../fluid/lib/popup";
import { SurfaceProvider, useSurface } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

const HOVER_CARD_OFFSET = 2;

const HoverCardOpenContext = createContext(false);

const HoverCardTrigger = HoverCardPrimitive.Trigger;

function HoverCard({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  openDelay = 200,
  closeDelay = 150,
  ...props
}: HoverCardPrimitive.HoverCardProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <HoverCardOpenContext.Provider value={open}>
      <HoverCardPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        openDelay={openDelay}
        closeDelay={closeDelay}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Root>
    </HoverCardOpenContext.Provider>
  );
}

const HoverCardContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, children, align = "center", sideOffset = 6, ...props }, ref) => {
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
    <HoverCardPrimitive.Portal forceMount>
      <HoverCardPrimitive.Content
        ref={ref}
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        asChild
        forceMount
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
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
