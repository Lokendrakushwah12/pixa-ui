"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Slot } from "../../fluid/shared/slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { IconComponent } from "../../fluid/lib/icon-context";
import { cn } from "../../lib/utils";
import { buttonLiftReset } from "../../fluid/lib/bevel";
import { useInButtonGroup } from "../../components/fluid/button-group";
import { Spinner, type SpinnerVariant } from "../../components/fluid/spinner";
import { useSizeVariant } from "../../fluid/lib/size-context";

const buttonVariants = cva(
  [
    "group relative isolate inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none cursor-pointer select-none",
    "transition-colors duration-80",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    buttonLiftReset,
  ],
  {
    variants: {
      variant: {
        primary: "text-primary-foreground",
        secondary: "text-foreground",
        outline: "text-foreground",
        ghost: "text-muted-foreground hover:text-foreground",
        destructive: "text-white",
        "destructive-ghost": "text-destructive",
        "destructive-outline": "text-destructive",
        default: "text-primary-foreground",
        link: "text-foreground underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground",
      },
      // piixa's geometry, not fluid's two-step ladder: this is piixa's
      // button now, and adopting a different height scale would reflow every
      // dense surface in the app by 4px. What carries over is the behaviour
      // — the bevel, the press-collapse, the loading state, the weight shift.
      size: {
        default: "h-8 gap-2 px-[calc(--spacing(3)-1px)] text-sm",
        icon: "size-8",
        "icon-lg": "size-9",
        "icon-sm": "size-7",
        "icon-xl": "size-10 [&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs":
          "size-6 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-[calc(--spacing(3.5)-1px)] text-sm",
        md: "h-8 gap-2 px-[calc(--spacing(3)-1px)] text-sm",
        sm: "h-7 gap-1.5 px-[calc(--spacing(2.5)-1px)] text-sm",
        xl: "h-10 gap-2 px-[calc(--spacing(4)-1px)] text-base [&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-6 gap-1 px-[calc(--spacing(2)-1px)] text-xs [&_svg:not([class*='size-'])]:size-3.5",
        // fluid's own names, folded onto the same scale
        compact: "h-7 gap-1.5 px-[calc(--spacing(2.5)-1px)] text-sm",
        "icon-compact": "size-7",
      },
      iconLeft: { true: "" },
      iconRight: { true: "" },
    },
    compoundVariants: [
      { size: "compact", iconLeft: true, className: "pl-2" },
      { size: "default", iconLeft: true, className: "pl-3" },
      { size: "compact", iconRight: true, className: "pr-2" },
      { size: "default", iconRight: true, className: "pr-3" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonSizeCanonical = "default" | "compact" | "icon" | "icon-compact";

type ButtonSize =
  | ButtonSizeCanonical
  | "sm"
  | "md"
  | "lg"
  | "xs"
  | "xl"
  | "icon-sm"
  | "icon-lg"
  | "icon-xs"
  | "icon-xl";

/** Older names, plus piixa's own ladder, folded onto the two-step scale. */
const legacySizeAliases: Partial<Record<ButtonSize, ButtonSizeCanonical>> = {
  lg: "default",
  md: "default",
  sm: "compact",
  xl: "default",
  xs: "compact",
  "icon-lg": "icon",
  "icon-sm": "icon-compact",
  "icon-xl": "icon",
  "icon-xs": "icon-compact",
};

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "size"> {
  size?: ButtonSize;
  asChild?: boolean;
  /** piixa's spelling of asChild: the element to render as. */
  render?: ReactElement;
  loading?: boolean;
  loadingVariant?: SpinnerVariant;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  active?: boolean;
}

type VariantMap = Record<string, string> & { primary: string };

const bgVariants: VariantMap = {
  primary:
    "[--btn-bg:var(--primary)] group-hover:[--btn-bg:color-mix(in_oklab,var(--primary)_90%,var(--background))] group-active:[--btn-bg:color-mix(in_oklab,var(--primary)_80%,var(--background))] bg-[var(--btn-bg)] shadow-[0_-1px_color-mix(in_oklab,var(--color-white)_16%,transparent),0_1px_2px_rgb(0_0_0_/_0.08),0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
  secondary:
    "[--btn-bg:var(--accent)] group-hover:[--btn-bg:color-mix(in_oklab,var(--accent)_80%,var(--background))] group-active:[--btn-bg:var(--accent)] bg-[var(--btn-bg)] shadow-[0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
  outline:
    "bg-transparent shadow-[0_-1px_color-mix(in_oklab,var(--color-white)_16%,transparent),0_1px_2px_rgb(0_0_0_/_0.04),0_0_0_1px_var(--border),inset_0_0_0_0px_var(--border)] group-hover:bg-hover group-active:bg-active group-active:shadow-[0_0_0_0px_var(--border),inset_0_0_0_1px_var(--border)]",
  ghost:
    "bg-transparent shadow-[0_0_0_1px_transparent] group-hover:bg-hover group-hover:shadow-[0_0_0_1px_var(--hover)] group-active:bg-active group-active:shadow-[0_0_0_0px_var(--active)]",
  destructive:
    "[--btn-bg:var(--destructive)] group-hover:[--btn-bg:color-mix(in_oklab,var(--destructive)_90%,var(--background))] group-active:[--btn-bg:color-mix(in_oklab,var(--destructive)_80%,var(--background))] bg-[var(--btn-bg)] shadow-[0_-1px_color-mix(in_oklab,var(--color-white)_16%,transparent),0_1px_2px_rgb(0_0_0_/_0.08),0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
  "destructive-ghost":
    "bg-transparent shadow-[0_0_0_1px_transparent] group-hover:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] group-hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--destructive)_12%,transparent)] group-active:bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] group-active:shadow-[0_0_0_0px_color-mix(in_oklab,var(--destructive)_18%,transparent)]",
  link: "bg-transparent shadow-none",
};

const pressCollapse = /\s*group-active:shadow-\[[^\]]*\]/g;
const neverMatches = /(?!)/g;

const activeBgVariants: VariantMap = {
  primary:
    "[--btn-bg:color-mix(in_oklab,var(--primary)_80%,var(--background))] bg-[var(--btn-bg)] shadow-[0_1px_2px_rgb(0_0_0_/_0.08),0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
  secondary:
    "[--btn-bg:var(--accent)] bg-[var(--btn-bg)] shadow-[0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
  outline:
    "bg-active shadow-[0_1px_2px_rgb(0_0_0_/_0.08),0_0_0_1px_var(--border),inset_0_0_0_0px_var(--border)] group-active:shadow-[0_0_0_0px_var(--border),inset_0_0_0_1px_var(--border)]",
  ghost:
    "bg-active shadow-[0_0_0_1px_var(--active)] group-active:shadow-[0_0_0_0px_var(--active)]",
  destructive:
    "[--btn-bg:color-mix(in_oklab,var(--destructive)_80%,var(--background))] bg-[var(--btn-bg)] shadow-[0_1px_2px_rgb(0_0_0_/_0.08),0_0_0_1px_var(--btn-bg)] group-active:shadow-[0_0_0_0px_var(--btn-bg)]",
  "destructive-ghost":
    "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--destructive)_18%,transparent)] group-active:shadow-[0_0_0_0px_color-mix(in_oklab,var(--destructive)_18%,transparent)]",
  link: "bg-transparent shadow-none",
};
activeBgVariants.default = activeBgVariants.primary as string;
activeBgVariants["destructive-outline"] = activeBgVariants[
  "destructive-ghost"
] as string;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      render,
      loading = false,
      loadingVariant = "bars",
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      active = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const asChildElement =
      render && isValidElement(render)
        ? (render as ReactElement<{ children?: ReactNode }>)
        : asChild && isValidElement(children)
        ? (children as ReactElement<{ children?: ReactNode }>)
        : null;
    const Comp = asChildElement ? Slot : "button";
    const label = asChildElement ? asChildElement.props.children : children;
    const contextSize = useSizeVariant();
    const resolvedSize: ButtonSizeCanonical = size
      ? legacySizeAliases[size] ?? (size as ButtonSizeCanonical)
      : contextSize === "compact"
        ? "compact"
        : "default";
    const isIconOnly = resolvedSize === "icon" || resolvedSize === "icon-compact";
    const isCompact =
      resolvedSize === "compact" || resolvedSize === "icon-compact";
    const iconSize = isCompact ? 14 : 16;
    const grouped = useInButtonGroup();
    const bgClass = (
      active
        ? activeBgVariants[variant ?? "primary"] ?? activeBgVariants.primary
        : bgVariants[variant ?? "primary"] ?? bgVariants.primary
    ).replace(grouped ? pressCollapse : neverMatches, "");

    const internals = (
      <>
        <span
          aria-hidden
          className={cn(
            "absolute inset-px rounded-[inherit] transition-[box-shadow,background-color] [transition-duration:180ms,80ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1),ease] group-active:[transition-duration:80ms,80ms]",
            bgClass
          )}
        />
        <span className="relative inline-flex items-center justify-center gap-[inherit]">
          {loading ? (
            <>
              <span className="flex items-center justify-center gap-[inherit] opacity-0">
                {LeadingIcon && !isIconOnly && (
                  <LeadingIcon size={iconSize} strokeWidth={2} />
                )}
                {label}
                {TrailingIcon && !isIconOnly && (
                  <TrailingIcon size={iconSize} strokeWidth={2} />
                )}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner variant={loadingVariant} size={iconSize} label={null} />
              </span>
            </>
          ) : isIconOnly ? (
            <span className="[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 group-hover:[&_svg]:stroke-[2]">
              {label ?? (LeadingIcon ? <LeadingIcon /> : null)}
            </span>
          ) : (
            <>
              {LeadingIcon && (
                <LeadingIcon
                  size={iconSize}
                  strokeWidth={1.5}
                  className="transition-[stroke-width] duration-80 group-hover:stroke-[2]"
                />
              )}
              {typeof label === "string" ? (
                <span className="[text-box:trim-both_cap_alphabetic]">
                  {label}
                </span>
              ) : (
                <span className="inline-flex items-center gap-[inherit] [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
                  {label}
                </span>
              )}
              {TrailingIcon && (
                <TrailingIcon
                  size={iconSize}
                  strokeWidth={1.5}
                  className="transition-[stroke-width] duration-80 group-hover:stroke-[2]"
                />
              )}
            </>
          )}
        </span>
      </>
    );

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({
            variant,
            size: resolvedSize,
            iconLeft: !isIconOnly && !!LeadingIcon,
            iconRight: !isIconOnly && !!TrailingIcon,
          }),
          isCompact ? "rounded-md" : "rounded-lg",
          className
        )}
        disabled={asChildElement ? undefined : disabled || loading}
        style={style}
        {...props}
      >
        {asChildElement
          ? cloneElement(asChildElement, undefined, internals)
          : internals}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps, ButtonSize };
