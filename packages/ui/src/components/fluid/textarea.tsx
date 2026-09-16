"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useShape } from "../../fluid/lib/shape-context";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: SizeVariant;
  autoResize?: boolean;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { size, autoResize = false, maxRows = 10, className, onInput, rows = 3, ...props },
    ref
  ) => {
    const sizeClasses = useSize(size);
    const shape = useShape();
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      const line = parseFloat(getComputedStyle(el).lineHeight) || 20;
      const padding = el.offsetHeight - el.clientHeight;
      const max = line * maxRows + padding;
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [autoResize, maxRows]);

    useLayoutEffect(resize, [resize, props.value]);
    useEffect(resize, [resize]);

    return (
      <textarea
        ref={setRefs}
        data-slot="textarea"
        rows={autoResize ? 1 : rows}
        onInput={(e) => {
          resize();
          onInput?.(e);
        }}
        className={cn(
          "w-full border border-border bg-background px-3 py-2",
          "text-foreground placeholder:text-muted-foreground",
          "outline-none transition-colors duration-100",
          "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring",
          "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50",
          autoResize ? "resize-none" : "resize-y",
          sizeClasses.text,
          shape.input,
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
