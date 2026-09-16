"use client";

import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  useId,
  type HTMLAttributes,
} from "react";
import { motion, useMotionValue, animate, type Transition } from "framer-motion";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";

interface SwitchProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  thumbTransition?: Transition;
  size?: SizeVariant;
}

const METRICS = {
  default: {
    trackWidth: 34,
    trackHeight: 20,
    thumbSize: 16,
    pillExtend: 2,
    pressExtend: 4,
    pressShrink: 4,
  },
  compact: {
    trackWidth: 28,
    trackHeight: 16,
    thumbSize: 12,
    pillExtend: 2,
    pressExtend: 3,
    pressShrink: 3,
  },
} as const;

const THUMB_OFFSET = 2;
const DRAG_DEAD_ZONE = 2;

const Switch = forwardRef<HTMLDivElement, SwitchProps>(
  ({ label, checked, onToggle, disabled = false, thumbTransition, size, className, ...props }, ref) => {
    const labelId = useId();
    const hasMounted = useRef(false);
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const sizeClasses = useSize(size);
    const m = METRICS[sizeClasses.variant];
    const thumbTravel = m.trackWidth - m.thumbSize - THUMB_OFFSET * 2;

    const dragging = useRef(false);
    const didDrag = useRef(false);
    const pointerStart = useRef<{
      clientX: number;
      originX: number;
    } | null>(null);

    const motionX = useMotionValue(
      checked ? THUMB_OFFSET + thumbTravel : THUMB_OFFSET
    );

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    const thumbWidth = pressed
      ? m.thumbSize + m.pressExtend
      : hovered
        ? m.thumbSize + m.pillExtend
        : m.thumbSize;
    const thumbHeight = pressed ? m.thumbSize - m.pressShrink : m.thumbSize;
    const thumbY = pressed ? THUMB_OFFSET + m.pressShrink / 2 : THUMB_OFFSET;
    const extraWidth = thumbWidth - m.thumbSize;
    const thumbX = checked
      ? THUMB_OFFSET + thumbTravel - extraWidth
      : THUMB_OFFSET;

    useEffect(() => {
      if (dragging.current) return;
      if (!hasMounted.current) {
        motionX.set(thumbX);
      } else {
        animate(motionX, thumbX, thumbTransition ?? spring.moderate);
      }
    }, [thumbX, motionX, thumbTransition]);

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        setPressed(true);
        dragging.current = false;
        didDrag.current = false;
        pointerStart.current = {
          clientX: e.clientX,
          originX: motionX.get(),
        };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, motionX]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!pointerStart.current) return;
        const delta = e.clientX - pointerStart.current.clientX;

        if (!dragging.current) {
          if (Math.abs(delta) < DRAG_DEAD_ZONE) return;
          dragging.current = true;
        }

        const dragMin = THUMB_OFFSET;
        const pressedThumbWidth = m.thumbSize + m.pressExtend;
        const dragMax = m.trackWidth - THUMB_OFFSET - pressedThumbWidth;
        const rawX = pointerStart.current.originX + delta;
        motionX.set(Math.max(dragMin, Math.min(dragMax, rawX)));
      },
      [motionX, m]
    );

    const handlePointerUp = useCallback(
      () => {
        if (!pointerStart.current) return;
        setPressed(false);

        if (dragging.current) {
          didDrag.current = true;
          dragging.current = false;

          const currentX = motionX.get();
          const dragMin = THUMB_OFFSET;
          const pressedThumbWidth = m.thumbSize + m.pressExtend;
          const dragMax = m.trackWidth - THUMB_OFFSET - pressedThumbWidth;
          const midpoint = (dragMin + dragMax) / 2;

          const shouldBeOn = currentX > midpoint;

          if (shouldBeOn !== checked) {
            onToggle();
          } else {
            const snapTarget = checked
              ? THUMB_OFFSET + thumbTravel
              : THUMB_OFFSET;
            animate(motionX, snapTarget, thumbTransition ?? spring.moderate);
          }

          requestAnimationFrame(() => {
            didDrag.current = false;
          });
        }

        pointerStart.current = null;
      },
      [checked, onToggle, motionX, thumbTransition, m, thumbTravel]
    );

    const handlePointerCancel = useCallback(
      () => {
        if (!pointerStart.current) return;
        setPressed(false);

        if (dragging.current) {
          dragging.current = false;
          const snapTarget = checked
            ? THUMB_OFFSET + thumbTravel
            : THUMB_OFFSET;
          animate(motionX, snapTarget, thumbTransition ?? spring.moderate);
        }

        pointerStart.current = null;
      },
      [checked, motionX, thumbTransition, thumbTravel]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 flex items-center cursor-pointer select-none touch-none",
          sizeClasses.gap,
          sizeClasses.px,
          sizeClasses.variant === "compact" ? "py-1" : "py-2",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={() => {
          if (disabled || didDrag.current) return;
          onToggle();
        }}
        {...props}
      >
        <SwitchPrimitive.Root
          checked={checked}
          aria-labelledby={labelId}
          onCheckedChange={() => {
            if (didDrag.current) return;
            onToggle();
          }}
          disabled={disabled}
          tabIndex={0}
          className={cn(
            "relative shrink-0 rounded-full outline-none cursor-pointer",
            "transition-colors duration-80",
            "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          style={{
            width: m.trackWidth,
            height: m.trackHeight,
            backgroundColor: checked
              ? hovered
                ? "color-mix(in oklab, var(--primary) 90%, var(--background))"
                : "var(--primary)"
              : hovered
                ? "color-mix(in oklab, var(--accent), rgb(var(--overlay)) 10%)"
                : "var(--accent)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <SwitchPrimitive.Thumb asChild>
            <motion.span
              className="absolute top-0 left-0 block rounded-full bg-white shadow-sm"
              initial={false}
              style={{ x: motionX }}
              animate={{
                y: thumbY,
                width: thumbWidth,
                height: thumbHeight,
              }}
              transition={hasMounted.current ? (thumbTransition ?? spring.moderate) : { duration: 0 }}
            />
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>

        <span
          id={labelId}
          className={cn(
            "[text-box:trim-both_cap_alphabetic] transition-[color] duration-80",
            sizeClasses.text,
            checked ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
export type { SwitchProps };
