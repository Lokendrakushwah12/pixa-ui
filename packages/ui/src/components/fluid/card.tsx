"use client";

import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { bevel } from "../../fluid/lib/bevel";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useIcon, type IconComponent } from "../../fluid/lib/icon-context";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

type CardOrientation = "card" | "inline";
type CardBorder = "none" | "outlined";

interface CardGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  selectedIndex: number;
  orientation: CardOrientation;
  columns: number;
  count: number;
  separated: boolean;
  divided: boolean;
  outlined: boolean;
}

const CardGroupContext = createContext<CardGroupContextValue | null>(null);

interface CardContextValue {
  emphasized: boolean;
  orientation: CardOrientation;
  clickable: boolean;
  hasImage: boolean;
}

const CardContext = createContext<CardContextValue>({
  emphasized: false,
  orientation: "card",
  clickable: false,
  hasImage: false,
});

interface CardGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrag"> {
  orientation?: CardOrientation;
  columns?: number;
  border?: CardBorder;
  separated?: boolean;
  fluidHover?: boolean;
}

const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  (
    {
      orientation = "card",
      columns = 1,
      border = "none",
      separated = false,
      fluidHover = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shape = useShape();

    const axis = columns > 1 ? "xy" : "y";
    const hover = useFluidHover(containerRef, { axis, gapClick: { maxDistance: 16 } });
    const {
      activeIndex,
      handlers,
      registerItem,
    } = hover;

    const childArray = Children.toArray(children).filter(isValidElement);
    const count = childArray.length;
    const indexed = childArray.map((child, i) =>
      cloneElement(child as ReactElement<{ index?: number }>, { index: i })
    );
    const selectedIndex = childArray.findIndex(
      (child) => (child.props as { selected?: boolean }).selected
    );

    const outlined = border === "outlined";
    const divided = !separated;

    const contextValue = useMemo<CardGroupContextValue>(
      () => ({
        registerItem,
        activeIndex,
        selectedIndex,
        orientation,
        columns,
        count,
        separated,
        divided,
        outlined,
      }),
      [
        registerItem,
        activeIndex,
        selectedIndex,
        orientation,
        columns,
        count,
        separated,
        divided,
        outlined,
      ]
    );

    return (
      <CardGroupContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          {...props}
          data-slot="card-group"
          data-orientation={orientation}
          className={cn(
            "relative grid",
            outlined && !separated && `border border-border/60 overflow-hidden ${shape.container}`,
            separated ? "gap-2" : "gap-0",
            className
          )}
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
          }}
          onMouseEnter={fluidHover ? handlers.onMouseEnter : undefined}
          onMouseMove={fluidHover ? handlers.onMouseMove : undefined}
          onMouseLeave={fluidHover ? handlers.onMouseLeave : undefined}
          onClick={fluidHover ? handlers.onClick : undefined}
        >
          <FluidHoverHighlight
            hover={hover}
              hidden={!fluidHover}
            className={cn("z-0", shape.container)}
          />

          {indexed}
        </div>
      </CardGroupContext.Provider>
    );
  }
);

CardGroup.displayName = "CardGroup";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  onClick?: () => void;
  href?: string;
  external?: boolean;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  dismissible?: boolean;
  dismissOnHover?: boolean;
  onDismiss?: () => void;
  size?: SizeVariant;
  index?: number;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      onClick,
      href,
      external,
      label,
      selected = false,
      disabled = false,
      dismissible = false,
      dismissOnHover = true,
      onDismiss,
      size,
      index,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const shape = useShape();
    const sizeClasses = useSize(size);
    const compact = sizeClasses.variant === "compact";
    const group = useContext(CardGroupContext);
    const XIcon = useIcon("x");

    const orientation = group?.orientation ?? "card";
    const columns = group?.columns ?? 1;
    const count = group?.count ?? 1;
    const separated = group?.separated ?? true;
    const divided = group?.divided ?? false;
    const outlined = group?.outlined ?? false;
    const activeIndex = group?.activeIndex ?? null;
    const selectedIndex = group?.selectedIndex ?? -1;

    const registerItem = href || onClick ? group?.registerItem : undefined;
    useRegisterFluidHoverItem(registerItem, index, internalRef);

    const col = index !== undefined ? index % columns : 0;
    const hasBelow = index !== undefined && index + columns < count;
    const hasRight =
      index !== undefined && col < columns - 1 && index + 1 < count;
    const self = index ?? -1;
    const touchesBelow = (i: number) => i === self || i === self + columns;
    const touchesRight = (i: number) => i === self || i === self + 1;
    const showBottom =
      divided &&
      hasBelow &&
      !(touchesBelow(activeIndex ?? -1) || touchesBelow(selectedIndex));
    const showRight =
      divided &&
      hasRight &&
      !(touchesRight(activeIndex ?? -1) || touchesRight(selectedIndex));

    const isInline = orientation === "inline";
    const isCardImage = (child: ReactNode) =>
      isValidElement(child) &&
      (child.type === CardImage ||
        (child.type as { displayName?: string })?.displayName === "CardImage");
    const hasImage = Children.toArray(children).some(isCardImage);
    const inlineImage = isInline && hasImage;
    const clickable = !!href || !!onClick;
    const emphasized = selected;

    const tileShape = !group
      ? cn(shape.container, "overflow-hidden")
      : separated && outlined
        ? cn(shape.container, "overflow-hidden border border-border/60")
        : "";

    const overlay = clickable && !disabled ? (
      href ? (
        <Link
          href={href}
          onClick={onClick}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={label}
          className="absolute inset-0 z-20 outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)] rounded-[inherit]"
        />
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={selected || undefined}
          className="absolute inset-0 z-20 outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)] rounded-[inherit]"
        />
      )
    ) : null;

    const cardContext = useMemo<CardContextValue>(
      () => ({ emphasized, orientation, clickable, hasImage }),
      [emphasized, orientation, clickable, hasImage]
    );

    let body: ReactNode = children;
    if (inlineImage) {
      const parts = Children.toArray(children);
      const image = parts.find(isCardImage);
      const rest = parts.filter((part) => part !== image);
      body = (
        <>
          {image}
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col justify-center gap-2",
              compact ? "py-2.5 pr-3" : "py-3.5 pr-4"
            )}
          >
            {rest}
          </div>
        </>
      );
    }

    const card = (
      <CardContext.Provider value={cardContext}>
        <div
          ref={(node) => {
            (internalRef as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          data-slot="card"
          data-fluid-hover-index={index}
          data-selected={selected || undefined}
          data-orientation={orientation}
          aria-disabled={disabled || undefined}
          className={cn(
            "group/card relative z-10 min-w-0 min-h-[60px]",
            bevel,
            inlineImage
              ?
                cn("flex flex-row items-center", compact ? "gap-2.5" : "gap-3")
              : isInline
                ? cn(
                    "flex flex-row items-center",
                    compact ? "gap-2.5 pl-3" : "gap-3 pl-4"
                  )
                : cn("flex flex-col", compact ? "pb-3" : "pb-4"),
            !group && clickable && !disabled && "transition-colors duration-80 hover:bg-hover",
            dismissible &&
              isInline &&
              (dismissOnHover
                ? "[&:hover_[data-slot=card-header]]:pr-10 [&:focus-within_[data-slot=card-header]]:pr-10"
                : "[&_[data-slot=card-header]]:pr-10"),
            tileShape,
            disabled && "opacity-50 pointer-events-none",
            className
          )}
          {...props}
        >
          {selected && (
            <span
              aria-hidden
              className={cn("absolute inset-0 -z-10 bg-active pointer-events-none", shape.container)}
            />
          )}

          {showBottom && (
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px bg-border/60 pointer-events-none -z-10"
            />
          )}
          {showRight && (
            <span
              aria-hidden
              className={cn(
                "absolute top-0 right-0 w-px bg-border/60 pointer-events-none -z-10",
                showBottom ? "bottom-px" : "bottom-0"
              )}
            />
          )}

          {overlay}

          {body}

          {dismissible && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className={cn(
                "absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer outline-none transition-colors duration-80 focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
                hasImage
                  ? "bg-card/70 backdrop-blur-sm hover:bg-card"
                  : "hover:bg-hover",
                dismissOnHover &&
                  "pointer-events-none opacity-0 transition-opacity duration-80 group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100",
                shape.button
              )}
            >
              <XIcon size={compact ? 13 : 15} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </CardContext.Provider>
    );

    return size ? <SizeProvider size={size}>{card}</SizeProvider> : card;
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation, hasImage } = useContext(CardContext);
    const inlineImage = orientation === "inline" && hasImage;
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
          inlineImage
            ? "min-w-0"
            : orientation === "inline"
              ? cn("min-w-0 flex-1", compact ? "py-2.5" : "py-3.5")
              : compact
                ? "px-3 pt-3"
                : "px-4 pt-4",
          className
        )}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    const { emphasized, orientation } = useContext(CardContext);
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const trim =
      orientation === "inline" ? "[text-box:trim-both_cap_alphabetic]" : "";
    return (
      <span
        ref={ref}
        data-slot="card-title"
        className={cn(
          "inline-grid grid-cols-[minmax(0,1fr)] leading-snug",
          compact ? "text-[13px]" : "text-[14px]",
          className
        )}
        {...props}
      >
        <span
          className={cn("col-start-1 row-start-1 invisible min-w-0 overflow-hidden text-ellipsis", trim)}
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {children}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 min-w-0 overflow-hidden text-ellipsis text-foreground transition-[font-variation-settings] duration-80",
            trim
          )}
          style={{
            fontVariationSettings: emphasized
              ? fontWeights.semibold
              : fontWeights.normal,
          }}
        >
          {children}
        </span>
      </span>
    );
  }
);

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const sizeClasses = useSize();
  const compact = sizeClasses.variant === "compact";
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(
        "leading-normal text-muted-foreground",
        compact ? "text-[13px]" : "text-[14px]",
        className
      )}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

const CardAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(
        "relative z-30 col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
);

CardAction.displayName = "CardAction";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useContext(CardContext);
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn(
          orientation === "inline" ? "" : compact ? "px-3 pt-2.5" : "px-4 pt-3",
          className
        )}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation, hasImage } = useContext(CardContext);
    const inlineImage = orientation === "inline" && hasImage;
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          "relative z-30 flex items-center gap-1",
          inlineImage
            ?
              "flex-wrap"
            : orientation === "inline"
              ? cn("shrink-0 ml-auto", compact ? "pr-3" : "pr-4")
              : cn("flex-wrap", compact ? "px-3 pt-2.5" : "px-4 pt-3"),
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

type CardLogo = string | [string, string];

interface CardMediaProps {
  logo?: CardLogo;
  logoAlt?: string;
  icon?: IconComponent;
  size?: number;
  className?: string;
}

function CardMedia({ logo, logoAlt, icon: Icon, size = 22, className }: CardMediaProps) {
  const { orientation } = useContext(CardContext);
  const shape = useShape();
  const sizeClasses = useSize();
  const compact = sizeClasses.variant === "compact";
  const wrap = cn(orientation === "inline" ? "" : "mb-2", className);

  if (logo) {
    const logos = Array.isArray(logo) ? logo : [logo];
    return (
      <span
        data-slot="card-media"
        className={cn("inline-flex items-center gap-1.5 shrink-0", wrap)}
      >
        {logos.map((src, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="w-2 h-px bg-border" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={logoAlt ?? ""}
              width={size}
              height={size}
              className={cn("object-contain", shape.bg)}
              style={{ width: size, height: size }}
            />
          </span>
        ))}
      </span>
    );
  }
  if (Icon) {
    return (
      <span
        data-slot="card-media"
        className={cn(
          "inline-flex items-center justify-center shrink-0 size-8 bg-hover",
          shape.bg,
          wrap
        )}
      >
        <Icon size={compact ? 16 : 18} strokeWidth={1.5} className="text-muted-foreground" />
      </span>
    );
  }
  return null;
}

interface CardImageProps {
  src: string;
  alt?: string;
  className?: string;
}

function CardImage({ src, alt, className }: CardImageProps) {
  const { orientation } = useContext(CardContext);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      data-slot="card-image"
      className={cn(
        "object-cover rounded-[2px]",
        orientation === "inline"
          ? "size-40 shrink-0"
          : "w-full aspect-[16/9]",
        className
      )}
    />
  );
}

CardImage.displayName = "CardImage";

const CardEyebrow = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const compact = useSize().variant === "compact";
    return (
      <span
        ref={ref}
        data-slot="card-eyebrow"
        className={cn(
          compact ? "text-[11px]" : "text-[12px]",
          "uppercase tracking-wide text-muted-foreground",
          className
        )}
        style={{ fontVariationSettings: fontWeights.semibold }}
        {...props}
      />
    );
  }
);

CardEyebrow.displayName = "CardEyebrow";

interface CardFeatureProps {
  icon?: IconComponent;
  title: string;
  description?: string;
}

function CardFeature({ icon: Icon, title, description }: CardFeatureProps) {
  const sizeClasses = useSize();
  const compact = sizeClasses.variant === "compact";
  return (
    <div
      data-slot="card-feature"
      className={cn("flex items-start", sizeClasses.gap)}
    >
      {Icon && (
        <Icon
          size={sizeClasses.icon}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-muted-foreground"
        />
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={cn(
            "text-foreground [text-box:trim-both_cap_alphabetic]",
            sizeClasses.text
          )}
          style={{ fontVariationSettings: fontWeights.medium }}
        >
          {title}
        </span>
        {description && (
          <span
            className={cn(
              "leading-relaxed text-muted-foreground",
              compact ? "text-[11px]" : "text-[12px]"
            )}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

type CardButtonVariant = "primary" | "secondary" | "ghost" | "link";

const CARD_BUTTON_VARIANTS: Record<CardButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/80",
  secondary: "bg-accent text-foreground hover:bg-accent/80 active:bg-accent",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active",
  link: "text-foreground underline-offset-4 hover:underline !px-0 !h-auto",
};

interface CardButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: CardButtonVariant;
  icon?: IconComponent;
  iconPosition?: "start" | "end";
  external?: boolean;
  disabled?: boolean;
}

function CardButton({
  children,
  onClick,
  href,
  variant = "ghost",
  icon: Icon,
  iconPosition,
  external = false,
  disabled = false,
}: CardButtonProps) {
  const shape = useShape();
  const ArrowRight = useIcon("arrow-right");
  const sizeClasses = useSize();
  const compact = sizeClasses.variant === "compact";
  const position = iconPosition ?? (external ? "end" : "start");

  const glyph = Icon ? (
    <Icon
      size={compact ? 12 : 14}
      strokeWidth={1.5}
      className="shrink-0 transition-[stroke-width] duration-80 group-hover/action:stroke-[2]"
    />
  ) : null;
  const externalGlyph = external ? (
    <ArrowRight
      size={13}
      strokeWidth={1.5}
      className="shrink-0 -rotate-45 transition-[stroke-width] duration-80 group-hover/action:stroke-[2]"
    />
  ) : null;

  const inner = (
    <>
      {position === "start" && glyph}
      <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>
      {position === "end" && glyph}
      {externalGlyph}
    </>
  );

  const classes = cn(
    "group/action relative z-30 inline-flex items-center justify-center gap-1.5 h-7 px-2.5 cursor-pointer outline-none",
    compact ? "text-[11px]" : "text-[12px]",
    "transition-colors duration-80",
    "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
    "disabled:opacity-50 disabled:pointer-events-none",
    shape.button,
    CARD_BUTTON_VARIANTS[variant]
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        style={{ fontVariationSettings: fontWeights.medium }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={{ fontVariationSettings: fontWeights.medium }}
    >
      {inner}
    </button>
  );
}

export {
  Card,
  CardGroup,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardMedia,
  CardImage,
  CardEyebrow,
  CardFeature,
  CardButton,
};
export type {
  CardProps,
  CardGroupProps,
  CardLogo,
  CardButtonProps,
  CardButtonVariant,
};
