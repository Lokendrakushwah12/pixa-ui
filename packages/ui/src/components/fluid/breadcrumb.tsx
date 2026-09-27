"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Slot } from "../../fluid/shared/slot";
import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";

const Breadcrumb = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"nav"> & { label?: string }
>(({ label = "Breadcrumb", ...props }, ref) => (
  <nav ref={ref} aria-label={label} data-slot="breadcrumb" {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = forwardRef<HTMLOListElement, ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn(
        "rounded-sm transition-colors duration-100 hover:text-foreground",
        "outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"li"> & { children?: ReactNode }) {
  const ChevronRight = useIcon("chevron-right");
  return (
    <li
      role="presentation"
      aria-hidden
      data-slot="breadcrumb-separator"
      className={cn("text-muted-foreground/60 [&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden
      data-slot="breadcrumb-ellipsis"
      className={cn("px-1", className)}
      {...props}
    >
      …
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
