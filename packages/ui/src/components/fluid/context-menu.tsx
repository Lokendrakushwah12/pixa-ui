"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize } from "../../fluid/lib/size-context";
import { popupMotionClass } from "../../fluid/lib/popup";
import { SurfaceProvider, useSurface } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

const MENU_OFFSET = 2;

const ContextMenuOpenContext = createContext(false);

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const ContextMenuSub = ContextMenuPrimitive.Sub;

function ContextMenu({
  children,
  onOpenChange,
  ...props
}: ContextMenuPrimitive.ContextMenuProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <ContextMenuOpenContext.Provider value={open}>
      <ContextMenuPrimitive.Root onOpenChange={handleOpenChange} {...props}>
        {children}
      </ContextMenuPrimitive.Root>
    </ContextMenuOpenContext.Provider>
  );
}

function useMenuSurface() {
  const substrate = useSurface();
  return Math.min(substrate + MENU_OFFSET, 8);
}

const ContextMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const open = useContext(ContextMenuOpenContext);
  const shape = useShape();
  const level = useMenuSurface();
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
    <ContextMenuPrimitive.Portal forceMount>
      <ContextMenuPrimitive.Content
        ref={ref}
        data-slot="context-menu-content"
        asChild
        forceMount
        {...props}
      >
        <motion.div
          className={cn(
            "z-50 min-w-40 border border-border p-1 focus:outline-none",
            popupMotionClass,
            surfaceClasses(level),
            shape.container,
            className
          )}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
          transition={open ? spring.moderate : spring.moderate.exit}
          onAnimationComplete={() => {
            if (!open) setMounted(false);
          }}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

function useMenuItemClass(inset?: boolean) {
  const sizeClasses = useSize();
  const shape = useShape();
  return cn(
    "relative flex cursor-default select-none items-center outline-none",
    "transition-colors duration-100",
    "focus:bg-accent focus:text-accent-foreground",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&>svg]:size-4 [&>svg]:shrink-0",
    sizeClasses.control,
    sizeClasses.itemPx,
    sizeClasses.text,
    sizeClasses.gap,
    inset && "pl-8",
    shape.item
  );
}

const ContextMenuItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    data-slot="context-menu-item"
    className={cn(
      useMenuItemClass(inset),
      destructive && "text-destructive focus:bg-destructive/10 focus:text-destructive",
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  const CheckIcon = useIcon("check");
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(useMenuItemClass(true), className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const DotIcon = useIcon("dot");
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(useMenuItemClass(true), className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <DotIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => {
  const ChevronRight = useIcon("chevron-right");
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        useMenuItemClass(inset),
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
});
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, children, ...props }, ref) => {
  const shape = useShape();
  const level = useMenuSurface();
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent ref={ref} asChild {...props}>
        <motion.div
          className={cn(
            "z-50 min-w-36 border border-border p-1 focus:outline-none",
            popupMotionClass,
            surfaceClasses(level + 1 > 8 ? 8 : level + 1),
            shape.container,
            className
          )}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring.moderate}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </ContextMenuPrimitive.SubContent>
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuSubContent.displayName = "ContextMenuSubContent";

const ContextMenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

function ContextMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-[11px] tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
};
