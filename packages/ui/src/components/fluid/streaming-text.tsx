"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

interface StreamingTextProps {
  text: string;
  speed?: number;
  cursor?: boolean;
  onDone?: () => void;
  className?: string;
}

function StreamingText({
  text,
  speed = 220,
  cursor = true,
  onDone,
  className,
}: StreamingTextProps) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(reduceMotion ? text.length : 0);
  const doneRef = useRef(false);

  const [prevText, setPrevText] = useState(text);
  if (prevText !== text) {
    setPrevText(text);
    if (!text.startsWith(prevText)) setShown(0);
  }

  useEffect(() => {
    if (reduceMotion) {
      setShown(text.length);
      return;
    }
    if (shown >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }

    let raf = 0;
    const startedAt = performance.now();
    const startedFrom = shown;

    const tick = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      const next = Math.min(text.length, startedFrom + Math.floor(elapsed * speed));
      setShown(next);
      if (next < text.length) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, speed, shown, reduceMotion, onDone]);

  const streaming = shown < text.length;

  return (
    <span data-slot="streaming-text" className={cn("whitespace-pre-wrap", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, shown)}</span>
      {cursor && streaming && (
        <span
          aria-hidden
          className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.1em] animate-caret-blink bg-foreground"
        />
      )}
    </span>
  );
}

export { StreamingText };
export type { StreamingTextProps };
