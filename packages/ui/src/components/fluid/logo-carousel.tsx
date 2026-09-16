"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";

interface LogoItem {
  id: string;
  node: ReactNode;
  name: string;
}

interface LogoCarouselProps {
  logos: LogoItem[];
  columns?: number;
  interval?: number;
  className?: string;
}

function LogoCarousel({
  logos,
  columns = 4,
  interval = 2.6,
  className,
}: LogoCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduceMotion || logos.length <= columns) return;
    const id = window.setInterval(
      () => setTick((t) => t + 1),
      Math.max(600, interval * 1000)
    );
    return () => window.clearInterval(id);
  }, [reduceMotion, interval, logos.length, columns]);

  const slots = Array.from(
    { length: Math.min(columns, logos.length) },
    (_, i) => {
      const index = (i + tick * columns) % logos.length;
      return { slot: i, logo: logos[index] };
    }
  ).filter((s): s is { slot: number; logo: LogoItem } => s.logo !== undefined);

  return (
    <div className={cn("w-full", className)}>
      <ul className="sr-only">
        {logos.map((logo) => (
          <li key={logo.id}>{logo.name}</li>
        ))}
      </ul>

      <div
        aria-hidden
        className="grid items-center gap-4"
        style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}
      >
        {slots.map(({ slot, logo }) => (
          <div key={slot} className="relative flex h-12 items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={logo.id}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...spring.slow, delay: slot * 0.06 }
                }
                className="flex items-center justify-center text-muted-foreground"
              >
                {logo.node}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

const placeholderLogos: LogoItem[] = [
  {
    id: "northwind",
    name: "Northwind",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3 14 9 4l6 10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="text-[13px] font-medium">Northwind</span>
      </span>
    ),
  },
  {
    id: "helios",
    name: "Helios",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[13px] font-medium">Helios</span>
      </span>
    ),
  },
  {
    id: "meridian",
    name: "Meridian",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <rect x="3" y="3" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9h12" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[13px] font-medium">Meridian</span>
      </span>
    ),
  },
  {
    id: "quarry",
    name: "Quarry",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M9 2l6 3.5v7L9 16l-6-3.5v-7L9 2z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[13px] font-medium">Quarry</span>
      </span>
    ),
  },
  {
    id: "lumen",
    name: "Lumen",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M4 9a5 5 0 1 1 10 0 5 5 0 0 1-10 0z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 9h5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[13px] font-medium">Lumen</span>
      </span>
    ),
  },
  {
    id: "tessera",
    name: "Tessera",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="1.6" />
          <rect x="10" y="10" width="5" height="5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[13px] font-medium">Tessera</span>
      </span>
    ),
  },
  {
    id: "sable",
    name: "Sable",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3 12c4 0 4-6 8-6M3 6c4 0 4 6 8 6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[13px] font-medium">Sable</span>
      </span>
    ),
  },
  {
    id: "orrery",
    name: "Orrery",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="2" fill="currentColor" />
          <ellipse cx="9" cy="9" rx="6.5" ry="3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span className="text-[13px] font-medium">Orrery</span>
      </span>
    ),
  },
];

export { LogoCarousel, placeholderLogos };
export type { LogoCarouselProps, LogoItem };
