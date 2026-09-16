"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { SurfaceProvider, useSurface } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

const SHEET_OFFSET = 4;

type SheetSide = "top" | "right" | "bottom" | "left";

const SheetOpenContext = createContext(false);

const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

function Sheet({
  children,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: DialogPrimitive.DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <SheetOpenContext.Provider value={open}>
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props}>
        {children}
      </DialogPrimitive.Root>
    </SheetOpenContext.Provider>
  );
}

const edge: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 max-h-[85dvh] w-full border-b",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full border-t",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
};

const offscreen: Record<SheetSide, { x: string | number; y: string | number }> = {
  top: { x: 0, y: "-100%" },
  bottom: { x: 0, y: "100%" },
  left: { x: "-100%", y: 0 },
  right: { x: "100%", y: 0 },
};

interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide;
  showCloseButton?: boolean;
}

const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
    const XIcon = useIcon("x");
    const open = useContext(SheetOpenContext);
    const shape = useShape();
    const substrate = useSurface();
    const level = Math.min(substrate + SHEET_OFFSET, 8);
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

    const rest = { x: 0, y: 0 };

    return (
      <DialogPrimitive.Portal forceMount>
        <DialogPrimitive.Overlay asChild forceMount>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 dark:bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={open ? spring.moderate : spring.moderate.exit}
          />
        </DialogPrimitive.Overlay>

        <DialogPrimitive.Content ref={ref} asChild forceMount {...props}>
          <motion.div
            className={cn(
              "fixed z-50 flex flex-col gap-4 border-border p-6 focus:outline-none",
              edge[side],
              surfaceClasses(level),
              side === "left" && shape.container && "rounded-l-none",
              side === "right" && shape.container && "rounded-r-none",
              side === "top" && shape.container && "rounded-t-none",
              side === "bottom" && shape.container && "rounded-b-none",
              className
            )}
            initial={offscreen[side]}
            animate={open ? rest : offscreen[side]}
            transition={open ? spring.moderate : spring.moderate.exit}
            onAnimationComplete={() => {
              if (!open) setMounted(false);
            }}
          >
            <SurfaceProvider value={level}>
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close
                  aria-label="Close"
                  className={cn(
                    "absolute top-4 right-4 rounded-md p-1 text-muted-foreground",
                    "transition-colors duration-100 hover:text-foreground",
                    "outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "[&>svg]:size-4"
                  )}
                >
                  <XIcon />
                </DialogPrimitive.Close>
              )}
            </SurfaceProvider>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex gap-2", className)} {...props} />;
}

const SheetTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-[16px] font-medium text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[13px] text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
export type { SheetSide, SheetContentProps };
