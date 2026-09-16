"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
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
  ComponentPropsWithoutRef<typeof MenubarPrimitive>
>(({ className, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  return (
    <MenubarPrimitive
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

const MenubarMenu = MenuPrimitive.Root;
const MenubarGroup = MenuPrimitive.Group;
const MenubarRadioGroup = MenuPrimitive.RadioGroup;
const MenubarSub = MenuPrimitive.SubmenuRoot;

const MenubarTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  return (
    <MenuPrimitive.Trigger
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
  ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> & {
    align?: ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>["align"];
    sideOffset?: number;
  }
>(({ className, children, align = "start", sideOffset = 6, ...props }, ref) => {
  const shape = useShape();
  const level = useMenuSurface();
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner align={align} className="z-50" sideOffset={sideOffset}>
      <MenuPrimitive.Popup
        ref={ref}
        data-slot="menubar-content"
        render={<motion.div />}
        {...props}
        className={cn(
            "z-50 min-w-40 border border-border p-1 focus:outline-none",
            popupMotionClass,
            surfaceClasses(level),
            shape.container,
            className
          )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: "var(--popup-enter-y)" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={spring.moderate}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
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
  ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  return (
    <MenuPrimitive.Item
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
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  const CheckIcon = useIcon("check");
  return (
    <MenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(menuItemClass(sizeClasses, shape.item, true), className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
});
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

const MenubarRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  const DotIcon = useIcon("dot");
  return (
    <MenuPrimitive.RadioItem
      ref={ref}
      className={cn(menuItemClass(sizeClasses, shape.item, true), className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <DotIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
});
MenubarRadioItem.displayName = "MenubarRadioItem";

const MenubarSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => {
  const sizeClasses = useSize();
  const shape = useShape();
  const ChevronRight = useIcon("chevron-right");
  return (
    <MenuPrimitive.SubmenuTrigger
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
    </MenuPrimitive.SubmenuTrigger>
  );
});
MenubarSubTrigger.displayName = "MenubarSubTrigger";

const MenubarSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, children, ...props }, ref) => {
  const shape = useShape();
  const level = useMenuSurface();
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="z-50">
      <MenuPrimitive.Popup
        ref={ref}
        render={<motion.div />}
        {...props}
        className={cn(
            "z-50 min-w-36 border border-border p-1 focus:outline-none",
            popupMotionClass,
            surfaceClasses(Math.min(level + 1, 8)),
            shape.container,
            className
          )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring.moderate}
        >
          <SurfaceProvider value={level}>{children}</SurfaceProvider>
        </motion.div>
      </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
});
MenubarSubContent.displayName = "MenubarSubContent";

const MenubarLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
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
  ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
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
