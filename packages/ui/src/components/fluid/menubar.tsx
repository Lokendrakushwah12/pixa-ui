"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize } from "../../fluid/lib/size-context";
import { popupMotionClass } from "../../fluid/lib/popup";
import { SurfaceProvider, useSurface } from "../../fluid/lib/surface-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";

const MENU_OFFSET = 2;

const Menubar = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  return (
    <MenubarPrimitive.Root
      ref={ref}
      data-slot="menubar"
      className={cn(
        "flex items-center border border-border bg-background",
        sizeClasses.segmentPad,
        sizeClasses.gap,
        shape.container,
        className
      )}
      {...props}
    />
  );
});
Menubar.displayName = "Menubar";

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const MenubarSub = MenubarPrimitive.Sub;

const MenubarTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default select-none items-center font-medium outline-none",
        "transition-colors duration-100",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        "focus-visible:ring-1 focus-visible:ring-ring",
        sizeClasses.segmentItem,
        sizeClasses.px,
        sizeClasses.text,
        shape.item,
        className
      )}
      {...props}
    />
  );
});
MenubarTrigger.displayName = "MenubarTrigger";

function useMenuSurface() {
  const substrate = useSurface();
  return Math.min(substrate + MENU_OFFSET, 8);
}

const MenubarContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, children, align = "start", sideOffset = 6, ...props }, ref) => {
  const shape = useShape();
  const level = useMenuSurface();
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        asChild
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
          initial={{ opacity: 0, scale: 0.97, y: "var(--popup-enter-y)" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={spring.moderate}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </MenubarPrimitive.Content>
    </MenubarPrimitive.Portal>
  );
});
MenubarContent.displayName = "MenubarContent";

function menuItemClass(
  sizeClasses: ReturnType<typeof useSize>,
  shapeItem: string,
  inset?: boolean
) {
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
    shapeItem
  );
}

const MenubarItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  return (
    <MenubarPrimitive.Item
      ref={ref}
      data-slot="menubar-item"
      className={cn(
        menuItemClass(sizeClasses, shape.item, inset),
        destructive && "text-destructive focus:bg-destructive/10 focus:text-destructive",
        className
      )}
      {...props}
    />
  );
});
MenubarItem.displayName = "MenubarItem";

const MenubarCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  const CheckIcon = useIcon("check");
  return (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(menuItemClass(sizeClasses, shape.item, true), className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

const MenubarRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  const DotIcon = useIcon("dot");
  return (
    <MenubarPrimitive.RadioItem
      ref={ref}
      className={cn(menuItemClass(sizeClasses, shape.item, true), className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <DotIcon />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});
MenubarRadioItem.displayName = "MenubarRadioItem";

const MenubarSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  const ChevronRight = useIcon("chevron-right");
  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      className={cn(
        menuItemClass(sizeClasses, shape.item, inset),
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </MenubarPrimitive.SubTrigger>
  );
});
MenubarSubTrigger.displayName = "MenubarSubTrigger";

const MenubarSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, children, ...props }, ref) => {
  const shape = useShape();
  const level = useMenuSurface();
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent ref={ref} asChild {...props}>
        <motion.div
          className={cn(
            "z-50 min-w-36 border border-border p-1 focus:outline-none",
            popupMotionClass,
            surfaceClasses(Math.min(level + 1, 8)),
            shape.container,
            className
          )}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring.moderate}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </MenubarPrimitive.SubContent>
    </MenubarPrimitive.Portal>
  );
});
MenubarSubContent.displayName = "MenubarSubContent";

const MenubarLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
MenubarLabel.displayName = "MenubarLabel";

const MenubarSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
MenubarSeparator.displayName = "MenubarSeparator";

function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-[11px] tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarRadioGroup,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
};
