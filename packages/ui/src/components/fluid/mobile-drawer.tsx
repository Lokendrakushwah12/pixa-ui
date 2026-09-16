"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { motion } from "framer-motion";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useSurface, SurfaceProvider } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  triggerRef?: RefObject<HTMLElement | null>;
}

export function MobileDrawer({
  open,
  onClose,
  children,
  triggerRef,
}: MobileDrawerProps) {
  const substrate = useSurface();
  const level = Math.min(substrate + 2, 8);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => setMounted(false), exitFallbackMs(spring.moderate));
    return () => clearTimeout(id);
  }, [open]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      {mounted && (
        <DialogPrimitive.Portal keepMounted>
          <DialogPrimitive.Backdrop
            forceRender
            render={
              <motion.div
                className="fixed inset-0 bg-black/40 dark:bg-black/80 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 1 : 0 }}
                transition={open ? { duration: 0.16 } : spring.moderate.exit}
              />
            }
          />

          <DialogPrimitive.Popup
            aria-label="Navigation"
            finalFocus={triggerRef ?? undefined}
            render={<div />}
          >
            <motion.div
              className={`fixed top-0 left-0 bottom-0 w-64 ${surfaceClasses(level, 3)} z-50 overflow-y-auto p-4`}
              initial={{ x: "-100%" }}
              animate={{ x: open ? 0 : "-100%" }}
              transition={open ? spring.moderate : spring.moderate.exit}
              onAnimationComplete={() => {
                if (!open) setMounted(false);
              }}
            >
              <DialogPrimitive.Title className="sr-only">
                Navigation
              </DialogPrimitive.Title>
              <SurfaceProvider value={level}>{children}</SurfaceProvider>
            </motion.div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}

export default MobileDrawer;
