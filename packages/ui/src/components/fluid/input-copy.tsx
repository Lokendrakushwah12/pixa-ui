"use client";

import { forwardRef, useState, useCallback, useRef, useEffect, useId, type HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { spring } from "../../fluid/lib/springs";
import { Tooltip } from "../../components/fluid/tooltip";

type InputCopyVariant = "icon" | "button";
type InputCopyAlign = "right" | "left";

interface InputCopyProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: string;
  label?: string;
  onCopy?: () => void;
  disabled?: boolean;
  variant?: InputCopyVariant;
  align?: InputCopyAlign;
  size?: SizeVariant;
}

const InputCopy = forwardRef<HTMLDivElement, InputCopyProps>(
  ({ value, label, onCopy, disabled, variant = "icon", align = "right", size, className, ...props }, ref) => {
    const CopyIcon = useIcon("copy");
    const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
    const [copyCount, setCopyCount] = useState(0);
    const [tooltipState, setTooltipState] = useState<"idle" | "copied" | "suppressed">("idle");
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const tooltipVisibleRef = useRef(false);
    const tooltipWasVisibleRef = useRef(false);
    const shape = useShape();
    const sizeClasses = useSize(size);
    const rowPy = sizeClasses.variant === "compact" ? "py-1" : "py-2";

    const generatedId = useId();
    const labelId = label ? `${generatedId}-label` : undefined;
    const buttonId = `${generatedId}-button`;

    const handlePointerDown = useCallback(() => {
      tooltipWasVisibleRef.current = tooltipVisibleRef.current;
    }, []);

    const copyViaExecCommand = useCallback(() => {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(textarea);
      return ok;
    }, [value]);

    const handleCopy = useCallback(async () => {
      if (disabled) return;
      let ok = true;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        ok = copyViaExecCommand();
      }
      setStatus(ok ? "copied" : "error");
      setCopyCount((c) => c + 1);
      setTooltipState(tooltipWasVisibleRef.current ? "copied" : "suppressed");
      if (ok) onCopy?.();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setStatus("idle");
        setTooltipState("suppressed");
      }, 2000);
    }, [value, disabled, onCopy, copyViaExecCommand]);

    const handleTooltipOpenChange = useCallback((open: boolean) => {
      tooltipVisibleRef.current = open;
    }, []);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const handleMouseEnter = useCallback(() => {
      setTooltipState((prev) => prev === "suppressed" ? "idle" : prev);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setTooltipState((prev) => prev === "copied" ? "suppressed" : prev);
    }, []);

    const iconSwitch = (
      <AnimatePresence mode="wait" initial={false}>
        {status === "error" ? (
          <motion.span
            key={`error-${copyCount}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={spring.fast}
            className="flex items-center justify-center text-destructive [&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 group-hover:[&_svg]:stroke-[2]"
          >
            <svg
              width={14}
              height={14}
              viewBox="2 4 20 16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M9 9L15 15M15 9L9 15"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  transition: { duration: 0.08, ease: "easeOut" },
                }}
              />
            </svg>
          </motion.span>
        ) : status === "copied" ? (
          <motion.span
            key={`check-${copyCount}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={spring.fast}
            className="flex items-center justify-center [&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 group-hover:[&_svg]:stroke-[2]"
          >
            <svg
              width={14}
              height={14}
              viewBox="2 4 20 16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M6 12L10 16L18 8"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  transition: { duration: 0.08, ease: "easeOut" },
                }}
              />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={spring.fast}
            className="flex items-center justify-center"
          >
            <CopyIcon size={14} strokeWidth={1.5} className="transition-[stroke-width] duration-80 group-hover:stroke-[2]" />
          </motion.span>
        )}
      </AnimatePresence>
    );

    const actionElement = variant === "button" ? (
      <span
        className={cn(
          "shrink-0 flex items-center gap-1.5 px-1.5 transition-colors duration-80",
          rowPy,
          sizeClasses.text,
          "text-muted-foreground group-hover:text-foreground",
        )}
        style={{ fontVariationSettings: fontWeights.normal }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "error" ? (
            <motion.span
              key={`error-label-${copyCount}`}
              className="flex items-center gap-1.5 text-destructive"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring.fast}
            >
              <span className="flex items-center justify-center">
                <svg
                  width={14}
                  height={14}
                  viewBox="2 4 20 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M9 9L15 15M15 9L9 15"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: 1,
                      transition: { duration: 0.08, ease: "easeOut" },
                    }}
                  />
                </svg>
              </span>
              <span className="select-none inline-grid text-left">
                <span className="col-start-1 row-start-1 invisible" aria-hidden="true">Copied</span>
                <span className="col-start-1 row-start-1">Failed</span>
              </span>
            </motion.span>
          ) : status === "copied" ? (
            <motion.span
              key={`check-label-${copyCount}`}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring.fast}
            >
              <span className="flex items-center justify-center">
                <svg
                  width={14}
                  height={14}
                  viewBox="2 4 20 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M6 12L10 16L18 8"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: 1,
                      transition: { duration: 0.08, ease: "easeOut" },
                    }}
                  />
                </svg>
              </span>
              <span className="select-none inline-grid text-left">
                <span className="col-start-1 row-start-1 invisible" aria-hidden="true">Copied</span>
                <span className="col-start-1 row-start-1">Copied</span>
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="copy-label"
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring.fast}
            >
              <span className="flex items-center justify-center">
                <CopyIcon size={14} strokeWidth={1.5} className="transition-[stroke-width] duration-80 group-hover:stroke-[2]" />
              </span>
              <span className="select-none inline-grid text-left">
                <span className="col-start-1 row-start-1 invisible" aria-hidden="true">Copied</span>
                <span className="col-start-1 row-start-1">Copy</span>
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    ) : (
      <span
        className={cn(
          "shrink-0 px-1.5 transition-colors duration-80",
          rowPy,
          "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {iconSwitch}
      </span>
    );

    const valueElement = (
      <span
        className={cn(
          "flex-1 min-w-0 text-left text-foreground font-mono select-none truncate",
          sizeClasses.text,
          rowPy,
          align === "left" ? "pl-1" : "pl-0"
        )}
        style={{ fontVariationSettings: fontWeights.normal }}
      >
        <mark className="bg-transparent text-foreground transition-colors duration-80 group-hover:bg-primary/20 group-hover:text-foreground">
          {value}
        </mark>
      </span>
    );

    const buttonContent = align === "left" ? (
      <>{actionElement}{valueElement}</>
    ) : (
      <>{valueElement}{actionElement}</>
    );

    const button = (
      <button
        id={buttonId}
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleCopy}
        disabled={disabled}
        aria-label={
          status === "copied"
            ? "Copied"
            : status === "error"
              ? "Copy failed"
              : label
                ? "Copy"
                : "Copy to clipboard"
        }
        aria-labelledby={label ? `${buttonId} ${labelId}` : undefined}
        className={cn(
          "group flex items-center w-full cursor-pointer outline-none transition-all duration-80",
          "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
          shape.input
        )}
      >
        {buttonContent}
      </button>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-0.5",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {label && (
          <span
            id={labelId}
            className={cn(
              "text-muted-foreground",
              sizeClasses.text,
              align === "left" ? "pl-1" : "pl-0"
            )}
            style={{ fontVariationSettings: fontWeights.normal }}
          >
            {label}
          </span>
        )}
        {variant === "icon" ? (
          <Tooltip content={tooltipState === "idle" ? "Copy to clipboard" : status === "error" ? "Copy failed" : "Copied"} delayDuration={500} sideOffset={2} forceOpen={tooltipState === "copied" ? true : tooltipState === "suppressed" ? false : undefined} onOpenChange={handleTooltipOpenChange}>
            {button}
          </Tooltip>
        ) : (
          button
        )}
      </div>
    );
  }
);

InputCopy.displayName = "InputCopy";

export { InputCopy };
export type { InputCopyProps };
export default InputCopy;
