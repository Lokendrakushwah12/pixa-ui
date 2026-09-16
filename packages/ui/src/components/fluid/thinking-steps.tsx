"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useContext,
  createContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible } from "@base-ui/react/collapsible";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import type { IconName } from "../../fluid/lib/icon-context";
import { spring } from "../../fluid/lib/springs";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { Badge } from "../../components/fluid/badge";
import type { BadgeColor } from "../../components/fluid/badge";

const ThinkingStepsOpenContext = createContext(false);

interface TriggerRowProps extends HTMLAttributes<HTMLButtonElement> {
  open: boolean;
  children: ReactNode;
}

const TriggerRow = forwardRef<HTMLButtonElement, TriggerRowProps>(
  ({ open, children, className, ...props }, ref) => {
    const ChevronRight = useIcon("chevron-right");
    const shape = useShape();
    const sizeClasses = useSize();
    const [isHovered, setIsHovered] = useState(false);
    const highlighted = open || isHovered;

    return (
      <div
        className="relative w-fit"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className={`absolute inset-0 ${shape.bg} bg-hover pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: spring.fast.exit }}
              transition={{ duration: 0.08 }}
            />
          )}
        </AnimatePresence>
        <Collapsible.Trigger
          ref={ref}
          className={cn(
            `relative z-10 flex items-center gap-2.5 ${shape.item} ${sizeClasses.px} ${
              sizeClasses.variant === "compact" ? "py-1.5" : "py-2"
            } cursor-pointer outline-none select-none`,
            "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)] focus-visible:ring-offset-0",
            className
          )}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          <span className={cn("inline-grid text-left", sizeClasses.text)}>
            <span
              className="col-start-1 row-start-1 invisible"
              style={{ fontVariationSettings: fontWeights.semibold }}
              aria-hidden="true"
            >
              {children}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80",
                highlighted ? "text-foreground" : "text-muted-foreground"
              )}
              style={{
                fontVariationSettings: open
                  ? fontWeights.semibold
                  : fontWeights.normal,
              }}
            >
              {children}
            </span>
          </span>

          <motion.span
            className="shrink-0 inline-flex items-center justify-center"
            animate={{ rotate: open ? 90 : 0 }}
            transition={spring.fast}
          >
            <ChevronRight
              size={sizeClasses.icon}
              strokeWidth={highlighted ? 2 : 1.5}
              className={cn(
                "transition-[color,stroke-width] duration-80",
                highlighted ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </motion.span>
        </Collapsible.Trigger>
      </div>
    );
  }
);
TriggerRow.displayName = "ThinkingStepsTriggerRow";

interface CollapsePanelProps {
  open: boolean;
  children: ReactNode;
}

function CollapsePanel({ open, children }: CollapsePanelProps) {
  const compactStep = useSize().variant === "compact";
  const innerRef = useRef<HTMLDivElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const needsSnap = useRef(open);

  const measureRef = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    innerRef.current = el;
    if (!el) return;
    if (el.offsetHeight > 0) setContentHeight(el.offsetHeight);
    const ro = new ResizeObserver(() => {
      if (el.offsetHeight > 0) setContentHeight(el.offsetHeight);
    });
    ro.observe(el);
    roRef.current = ro;
  }, []);

  useIsoLayoutEffect(() => {
    if (open && innerRef.current && innerRef.current.offsetHeight > 0) {
      setContentHeight(innerRef.current.offsetHeight);
    }
  }, [open]);

  useEffect(() => {
    if (contentHeight !== null) needsSnap.current = false;
  }, [contentHeight]);

  const [exitComplete, setExitComplete] = useState(!open);
  if (open && exitComplete) {
    setExitComplete(false);
  }

  return (
    <Collapsible.Panel keepMounted hidden={!open && exitComplete} render={<div />}>
      <div>
        <motion.div
          className="overflow-hidden"
          initial={{ height: open ? "auto" : 0 }}
          animate={{ height: open ? contentHeight ?? 0 : 0 }}
          transition={
            needsSnap.current
              ? { duration: 0 }
              : { ...spring.moderate, bounce: 0 }
          }
          onAnimationComplete={() => {
            if (!open) setExitComplete(true);
          }}
        >
          <div
            ref={measureRef}
            className={cn(
              "px-3 pb-3 pt-1 text-muted-foreground",
              compactStep ? "text-[12px]" : "text-[13px]"
            )}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </Collapsible.Panel>
  );
}

interface ThinkingStepsProps extends HTMLAttributes<HTMLDivElement> {
  size?: SizeVariant;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const ThinkingSteps = forwardRef<HTMLDivElement, ThinkingStepsProps>(
  ({ size, defaultOpen = true, open, onOpenChange, children, className, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = open ?? internalOpen;

    const root = (
      <Collapsible.Root
        ref={ref}
        open={isOpen}
        onOpenChange={(next: boolean) => {
          if (open === undefined) setInternalOpen(next);
          onOpenChange?.(next);
        }}
        className={cn("w-80 max-w-full", className)}
        {...props}
      >
        <ThinkingStepsOpenContext.Provider value={isOpen}>
          {children}
        </ThinkingStepsOpenContext.Provider>
      </Collapsible.Root>
    );

    return size ? <SizeProvider size={size}>{root}</SizeProvider> : root;
  }
);
ThinkingSteps.displayName = "ThinkingSteps";

interface ThinkingStepsHeaderProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

const ThinkingStepsHeader = forwardRef<
  HTMLButtonElement,
  ThinkingStepsHeaderProps
>(({ children = "Thinking", className, ...props }, ref) => {
  const isOpen = useContext(ThinkingStepsOpenContext);
  return (
    <TriggerRow ref={ref} open={isOpen} className={className} {...props}>
      {children}
    </TriggerRow>
  );
});
ThinkingStepsHeader.displayName = "ThinkingStepsHeader";

interface ThinkingStepsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ThinkingStepsContent = forwardRef<
  HTMLDivElement,
  ThinkingStepsContentProps
>(({ children, className, ...props }, ref) => {
  const isOpen = useContext(ThinkingStepsOpenContext);
  return (
    <CollapsePanel open={isOpen}>
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </div>
    </CollapsePanel>
  );
});
ThinkingStepsContent.displayName = "ThinkingStepsContent";

type StepStatus = "complete" | "active" | "pending";

interface ThinkingStepProps {
  icon?: IconName;
  showIcon?: boolean;
  label: string;
  description?: string;
  status?: StepStatus;
  delay?: number;
  isLast?: boolean;
  children?: ReactNode;
  className?: string;
}

function useStepHeight() {
  const roRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const ref = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    if (!el) return;
    const sync = () => {
      if (el.offsetHeight > 0) setHeight(el.offsetHeight);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    roRef.current = ro;
  }, []);
  return [ref, height] as const;
}

function ThinkingStep({
  icon = "dot",
  showIcon = true,
  label,
  description,
  status = "complete",
  delay = 0.08,
  isLast = false,
  children,
  className,
}: ThinkingStepProps) {
    const Icon = useIcon(icon);
    const shape = useShape();
    const sizeClasses = useSize();
    const [stepRef, stepHeight] = useStepHeight();

    if (status === "pending") return null;

    const isActive = status === "active";

    return (
      <motion.div
        className={cn("relative z-10 overflow-hidden", className)}
        initial={{ height: 0 }}
        animate={{ height: stepHeight ?? 0 }}
        transition={spring.slow}
      >
        <motion.div
          ref={stepRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, delay, ease: "easeOut" }}
        >
          <div className={cn("flex gap-2.5 px-2 py-1.5", shape.item)}>
            <div className="flex flex-col items-center shrink-0 w-[14px]">
              <div className="pt-0.5">
                {showIcon ? (
                  <Icon
                    size={sizeClasses.variant === "compact" ? 12 : 14}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                ) : (
                  <div className="w-[14px] h-[14px] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
                  </div>
                )}
              </div>
              {!isLast && (
                <div className="flex-1 w-px bg-border/60 mt-1" />
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <span
                className={cn(
                  sizeClasses.text,
                  "leading-tight text-foreground",
                  isActive && "shimmer-text"
                )}
                style={{ fontVariationSettings: fontWeights.medium }}
              >
                {label}
                {isActive && "…"}
              </span>
              {description && (
                <span className={cn(sizeClasses.text, "text-muted-foreground leading-snug")}>
                  {description}
                </span>
              )}
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
}

interface ThinkingStepDetailsProps {
  summary: string;
  details?: string[];
  defaultOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

function ThinkingStepDetails({
  summary,
  details,
  defaultOpen = false,
  children,
  className,
}: ThinkingStepDetailsProps) {
  const compactStep = useSize().variant === "compact";
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn("mt-1 -ml-3", className)}
    >
      <TriggerRow open={open} className="py-1 px-3 gap-1.5">
        {summary}
      </TriggerRow>
      <CollapsePanel open={open}>
        <div className="flex flex-col gap-0.5 pt-0.5">
          {details?.map((item, i) => (
            <span
              key={i}
              className={cn(
                "text-muted-foreground leading-snug",
                compactStep ? "text-[11px]" : "text-[12px]"
              )}
            >
              {item}
            </span>
          ))}
          {children}
        </div>
      </CollapsePanel>
    </Collapsible.Root>
  );
}

interface ThinkingStepSourcesProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ThinkingStepSources = forwardRef<HTMLDivElement, ThinkingStepSourcesProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap gap-1.5 mt-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ThinkingStepSources.displayName = "ThinkingStepSources";

interface ThinkingStepSourceProps {
  color?: BadgeColor;
  delay?: number;
  children: ReactNode;
  className?: string;
}

function ThinkingStepSource({ color = "gray", delay = 0, children, className }: ThinkingStepSourceProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        ...spring.moderate,
        delay,
        filter: { duration: 0.12, delay },
      }}
    >
      <Badge variant="solid" size="sm" color={color} className={className}>
        {children}
      </Badge>
    </motion.span>
  );
}
ThinkingStepSource.displayName = "ThinkingStepSource";

interface ThinkingStepImageProps {
  src: string;
  alt?: string;
  caption?: string;
  delay?: number;
  className?: string;
}

function ThinkingStepImage({ src, alt = "", caption, delay = 0, className }: ThinkingStepImageProps) {
  const shape = useShape();
  const compact = useSize().variant === "compact";
  return (
    <motion.div
      className={cn("mt-1.5", className)}
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        opacity: { duration: 0.2, delay, ease: "easeOut" },
        filter: { duration: 0.15, delay },
      }}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full max-w-[200px] object-cover",
          shape.container
        )}
      />
      {caption && (
        <span
          className={cn(
            compact ? "text-[11px]" : "text-[12px]",
            "text-muted-foreground mt-1 block"
          )}
        >
          {caption}
        </span>
      )}
    </motion.div>
  );
}
ThinkingStepImage.displayName = "ThinkingStepImage";

export {
  ThinkingSteps,
  ThinkingStepsHeader,
  ThinkingStepsContent,
  ThinkingStep,
  ThinkingStepDetails,
  ThinkingStepSources,
  ThinkingStepSource,
  ThinkingStepImage,
};

export type {
  ThinkingStepsProps,
  ThinkingStepsHeaderProps,
  ThinkingStepsContentProps,
  ThinkingStepProps,
  ThinkingStepDetailsProps,
  ThinkingStepSourcesProps,
  ThinkingStepSourceProps,
  ThinkingStepImageProps,
  StepStatus,
};
