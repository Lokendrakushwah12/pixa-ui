"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";

interface InputDissolveProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  size?: SizeVariant;
  label?: string;
  stagger?: number;
}

function InputDissolve({
  value,
  onChange,
  size,
  label,
  stagger = 0.012,
  className,
  ...props
}: InputDissolveProps) {
  const sizeClasses = useSize(size);
  const shape = useShape();
  const reduceMotion = useReducedMotion();
  const inputId = useId();
  const [dissolving, setDissolving] = useState<{ id: number; text: string } | null>(null);

  const clear = useCallback(() => {
    if (!value) return;
    if (!reduceMotion) setDissolving({ id: Date.now(), text: value });
    onChange("");
  }, [value, onChange, reduceMotion]);

  const drift = useMemo(() => {
    const text = dissolving?.text ?? "";
    return Array.from(text, (_, i) => {
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const frac = seed - Math.floor(seed);
      return { x: (frac - 0.5) * 18, y: (frac - 0.5) * -24, rotate: (frac - 0.5) * 40 };
    });
  }, [dissolving]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[12px] text-muted-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              clear();
            }
          }}
          className={cn(
            "w-full border border-border bg-background",
            "text-foreground placeholder:text-muted-foreground",
            "outline-none transition-colors duration-100",
            "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses.control,
            sizeClasses.px,
            sizeClasses.text,
            shape.input,
            className
          )}
          {...props}
        />

        <AnimatePresence>
          {dissolving && (
            <motion.div
              key={dissolving.id}
              aria-hidden
              onAnimationComplete={() => setDissolving(null)}
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center whitespace-pre",
                sizeClasses.px,
                sizeClasses.text
              )}
            >
              {Array.from(dissolving.text, (char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)" }}
                  animate={{
                    opacity: 0,
                    x: drift[i]?.x ?? 0,
                    y: drift[i]?.y ?? 0,
                    rotate: drift[i]?.rotate ?? 0,
                    filter: "blur(2px)",
                  }}
                  transition={{ ...spring.slow, delay: i * stagger }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[11px] text-muted-foreground">Press Escape to dissolve</p>
    </div>
  );
}

export { InputDissolve };
export type { InputDissolveProps };
