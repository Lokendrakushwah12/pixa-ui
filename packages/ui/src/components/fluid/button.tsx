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
import { useShape } from "../../fluid/lib/shape-context";
import { useSizeVariant } from "../../fluid/lib/size-context";

const buttonVariants = cva(
  [
    "group relative isolate inline-flex items-center justify-center outline-none cursor-pointer select-none",
    "transition-colors duration-80",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
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
        link: "text-foreground underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground",
      },
      size: {
        default: "h-9 px-4 text-[13px] gap-1.5",
        compact: "h-7 px-3 text-[12px] gap-1",
        icon: "h-9 w-9 p-0 [&_svg]:h-4 [&_svg]:w-4",
        "icon-compact": "h-7 w-7 p-0 [&_svg]:h-3.5 [&_svg]:w-3.5",
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
  | "icon-sm"
  | "icon-lg";

const legacySizeAliases: Partial<Record<ButtonSize, ButtonSizeCanonical>> = {
  sm: "compact",
  md: "default",
  lg: "default",
  "icon-sm": "icon-compact",
  "icon-lg": "icon",
};

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "size"> {
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  loadingVariant?: SpinnerVariant;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  active?: boolean;
}

const bgVariants: Record<string, string> = {
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

const activeBgVariants: Record<string, string> = {
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
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
      asChild && isValidElement(children)
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
    const shape = useShape();
    const grouped = useInButtonGroup();
    const bgClass = (
      active
        ? activeBgVariants[variant ?? "primary"]
        : bgVariants[variant ?? "primary"]
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
              <span className="[text-box:trim-both_cap_alphabetic]">{label}</span>
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
        className={cn(
          buttonVariants({
            variant,
            size: resolvedSize,
            iconLeft: !isIconOnly && !!LeadingIcon,
            iconRight: !isIconOnly && !!TrailingIcon,
          }),
          shape.button,
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
