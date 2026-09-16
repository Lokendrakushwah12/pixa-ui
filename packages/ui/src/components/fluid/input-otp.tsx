"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";
import {
  OTPInput,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from "input-otp";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useShape } from "../../fluid/lib/shape-context";

type OTPMode = "digits" | "alphanumeric";

interface InputOTPProps
  extends Omit<
    ComponentPropsWithoutRef<typeof OTPInput>,
    "render" | "children" | "maxLength" | "pattern" | "size"
  > {
  maxLength?: number;
  groups?: number[];
  mode?: OTPMode;
  invalid?: boolean;
  size?: SizeVariant;
  containerClassName?: string;
}

const InputOTP = forwardRef<HTMLInputElement, InputOTPProps>(
  (
    {
      maxLength = 6,
      groups,
      mode = "digits",
      invalid = false,
      size,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const ringId = useId();
    const reduceMotion = useReducedMotion();

    const runs =
      groups && groups.reduce((a, b) => a + b, 0) === maxLength
        ? groups
        : [maxLength];

    const runRanges = runs.map((len, i) => ({
      start: runs.slice(0, i).reduce((a, b) => a + b, 0),
      len,
    }));

    return (
      <motion.div
        animate={invalid && !reduceMotion ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-fit"
      >
        <OTPInput
          ref={ref}
          maxLength={maxLength}
          pattern={
            mode === "digits" ? REGEXP_ONLY_DIGITS : REGEXP_ONLY_DIGITS_AND_CHARS
          }
          inputMode={mode === "digits" ? "numeric" : "text"}
          spellCheck={false}
          aria-invalid={invalid || undefined}
          containerClassName={cn(
            "flex items-center gap-2 has-disabled:opacity-50",
            containerClassName
          )}
          className={cn("disabled:cursor-not-allowed", className)}
          {...props}
          render={({ slots }) => (
            <>
              {runRanges.map((run, runIndex) => (
                <div key={run.start} className="flex items-center gap-1.5">
                  {runIndex > 0 && <InputOTPSeparator />}
                  {slots
                    .slice(run.start, run.start + run.len)
                    .map((slot, i) => (
                      <InputOTPSlot
                        key={run.start + i}
                        {...slot}
                        ringId={ringId}
                        invalid={invalid}
                        size={size}
                      />
                    ))}
                </div>
              ))}
            </>
          )}
        />
      </motion.div>
    );
  }
);
InputOTP.displayName = "InputOTP";

interface SlotProps {
  char: string | null;
  placeholderChar: string | null;
  isActive: boolean;
  hasFakeCaret: boolean;
  ringId: string;
  invalid: boolean;
  size?: SizeVariant;
}

function InputOTPSlot({
  char,
  placeholderChar,
  isActive,
  hasFakeCaret,
  ringId,
  invalid,
  size,
}: SlotProps) {
  const sizeClasses = useSize(size);
  const shape = useShape();
  const reduceMotion = useReducedMotion();

  const box =
    sizeClasses.variant === "compact" ? "h-7 w-7 text-[13px]" : "h-9 w-9 text-[15px]";

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      className={cn(
        "relative flex items-center justify-center tabular-nums",
        "border border-border bg-background text-foreground",
        "transition-colors duration-100",
        invalid && "border-destructive text-destructive",
        box,
        shape.input
      )}
    >
      {char ?? (
        <span className="text-muted-foreground/50">{placeholderChar}</span>
      )}

      {hasFakeCaret && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute h-4 w-px bg-foreground",
            !reduceMotion && "animate-caret-blink"
          )}
        />
      )}

      {isActive && (
        <motion.span
          aria-hidden
          layoutId={ringId}
          transition={reduceMotion ? { duration: 0 } : spring.moderate}
          className={cn(
            "pointer-events-none absolute -inset-px border-2",
            invalid ? "border-destructive" : "border-ring",
            shape.input
          )}
        />
      )}
    </div>
  );
}

function InputOTPSeparator() {
  return (
    <span
      role="separator"
      aria-hidden
      className="mx-1 h-px w-2 shrink-0 bg-border"
    />
  );
}

export { InputOTP, InputOTPSlot, InputOTPSeparator };
export type { InputOTPProps, OTPMode };
export default InputOTP;
