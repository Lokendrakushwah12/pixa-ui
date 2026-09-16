"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useShape } from "../../fluid/lib/shape-context";
import { SurfaceProvider, useSurface } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

const POPOVER_OFFSET = 2;

const PopoverOpenContext = createContext(false);

const PopoverAnchor = PopoverPrimitive.Anchor;

function Popover({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: PopoverPrimitive.PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <PopoverOpenContext.Provider value={open}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props}>
        {children}
      </PopoverPrimitive.Root>
    </PopoverOpenContext.Provider>
  );
}

const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => (
  <PopoverPrimitive.Trigger ref={ref} data-slot="popover-trigger" {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  padded?: boolean;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      children,
      align = "center",
      side = "bottom",
      sideOffset = 6,
      padded = true,
      ...props
    },
    ref
  ) => {
    const open = useContext(PopoverOpenContext);
    const shape = useShape();
    const substrate = useSurface();
    const level = Math.min(substrate + POPOVER_OFFSET, 8);
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

    const horizontal = side === "left" || side === "right";
    const lean = side === "top" || side === "left" ? 4 : -4;

    return (
      <PopoverPrimitive.Portal forceMount>
        <PopoverPrimitive.Content
          ref={ref}
          data-slot="popover-content"
          align={align}
          side={side}
          sideOffset={sideOffset}
          asChild
          forceMount
          {...props}
        >
          <motion.div
            className={cn(
              "z-50 min-w-32 border border-border focus:outline-none",
              padded && "p-3",
              surfaceClasses(level),
              shape.container,
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.96,
              x: horizontal ? lean : 0,
              y: horizontal ? 0 : lean,
            }}
            animate={{
              opacity: open ? 1 : 0,
              scale: open ? 1 : 0.96,
              x: open || !horizontal ? 0 : lean,
              y: open || horizontal ? 0 : lean,
            }}
            transition={open ? spring.moderate : spring.moderate.exit}
            onAnimationComplete={() => {
              if (!open) setMounted(false);
            }}
          >
            <SurfaceProvider value={level}>{children}</SurfaceProvider>
          </motion.div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
export type { PopoverContentProps };
