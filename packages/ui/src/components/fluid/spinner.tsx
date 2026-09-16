"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";

type SpinnerVariant =
  | "arc"
  | "bars"
  | "braille"
  | "breathe"
  | "cascade"
  | "checkerboard"
  | "columns"
  | "diagonal-swipe"
  | "fill-sweep"
  | "helix"
  | "orbit"
  | "pulse"
  | "rain"
  | "scan"
  | "snake"
  | "sparkle"
  | "wave-rows";

function hash(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type CellDelay = (r: number, c: number, rows: number, cols: number) => number | null;

interface GridSpec {
  rows: number;
  cols: number;
  duration: number;
  delay: CellDelay;
}

type GridVariant = Exclude<SpinnerVariant, "arc" | "bars">;

const GRIDS: Record<GridVariant, GridSpec> = {
  columns: { rows: 4, cols: 4, duration: 1.1, delay: (_r, c, _rows, cols) => c / cols },

  "wave-rows": {
    rows: 4, cols: 4, duration: 1.2,
    delay: (r, c, rows, cols) => r / rows + Math.sin((c / cols) * Math.PI) * 0.12,
  },

  scan: { rows: 5, cols: 5, duration: 1.1, delay: (r, _c, rows) => (r / rows) * 0.8 },

  cascade: {
    rows: 4, cols: 4, duration: 1.2,
    delay: (r, c, rows, cols) => (r + c) / (rows + cols),
  },
  "diagonal-swipe": {
    rows: 5, cols: 5, duration: 1.1,
    delay: (r, c, rows, cols) => (c - r + rows) / (rows + cols),
  },

  pulse: {
    rows: 5, cols: 5, duration: 1.3,
    delay: (r, c, rows, cols) => {
      const dr = r - (rows - 1) / 2;
      const dc = c - (cols - 1) / 2;
      return (Math.hypot(dr, dc) / Math.hypot(rows / 2, cols / 2)) * 0.7;
    },
  },

  breathe: {
    rows: 4, cols: 4, duration: 1.6,
    delay: (r, c, rows, cols) => {
      const dr = r - (rows - 1) / 2;
      const dc = c - (cols - 1) / 2;
      return Math.hypot(dr, dc) * 0.05;
    },
  },

  checkerboard: { rows: 4, cols: 4, duration: 1.0, delay: (r, c) => ((r + c) % 2) * 0.5 },

  snake: {
    rows: 4, cols: 4, duration: 1.6,
    delay: (r, c, rows, cols) => {
      const col = r % 2 === 0 ? c : cols - 1 - c;
      return (r * cols + col) / (rows * cols);
    },
  },

  orbit: {
    rows: 4, cols: 4, duration: 1.4,
    delay: (r, c, rows, cols) => {
      const onEdge = r === 0 || c === 0 || r === rows - 1 || c === cols - 1;
      if (!onEdge) return null;
      let i: number;
      if (r === 0) i = c;
      else if (c === cols - 1) i = cols - 1 + r;
      else if (r === rows - 1) i = cols - 1 + rows - 1 + (cols - 1 - c);
      else i = 2 * (cols - 1) + (rows - 1) + (rows - 1 - r);
      return i / (2 * (rows - 1) + 2 * (cols - 1));
    },
  },

  "fill-sweep": {
    rows: 4, cols: 4, duration: 1.8,
    delay: (_r, c, _rows, cols) => (c / cols) * 0.5,
  },

  braille: {
    rows: 4, cols: 3, duration: 1.4,
    delay: (r, c, _rows, cols) => {
      const i = r * cols + c;
      if (hash(i) < 0.4) return null;
      return hash(i + 99) * 0.7;
    },
  },

  sparkle: {
    rows: 5, cols: 5, duration: 1.5,
    delay: (r, c, _rows, cols) => hash(r * cols + c) * 0.9,
  },

  rain: {
    rows: 5, cols: 4, duration: 1.2,
    delay: (r, c, rows) => (r / rows) * 0.6 + hash(c * 7.7) * 0.5,
  },

  helix: {
    rows: 5, cols: 7, duration: 1.4,
    delay: (r, c, rows, cols) => {
      const phase = (c / cols) * Math.PI * 2;
      const strand = Math.round(((Math.sin(phase) + 1) / 2) * (rows - 1));
      const mirror = rows - 1 - strand;
      if (r !== strand && r !== mirror) return null;
      return (c / cols) * 0.8;
    },
  },
};

interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?: SpinnerVariant;
  size?: SizeVariant | number;
  label?: string | null;
}

function usePixelSize(size: SizeVariant | number | undefined, variant: SpinnerVariant): number {
  const ladder = useSize(typeof size === "number" ? undefined : size);
  if (typeof size === "number") return size;
  if (variant === "arc") return ladder.icon;
  return ladder.variant === "compact" ? 20 : 26;
}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ variant = "arc", size, label = "Loading", className, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const px = usePixelSize(size, variant);

    return (
      <span
        ref={ref}
        data-slot="spinner"
        data-variant={variant}
        role={label ? "status" : undefined}
        aria-label={label ?? undefined}
        aria-hidden={label ? undefined : true}
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        {...props}
      >
        {variant === "arc" ? (
          <Arc size={px} />
        ) : variant === "bars" ? (
          <Bars size={px} reduceMotion={!!reduceMotion} />
        ) : (
          <Grid spec={GRIDS[variant]} size={px} reduceMotion={!!reduceMotion} />
        )}
      </span>
    );
  }
);
Spinner.displayName = "Spinner";

function Arc({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="47 16"
        className="opacity-90"
      />
    </svg>
  );
}

function Grid({
  spec,
  size,
  reduceMotion,
}: {
  spec: GridSpec;
  size: number;
  reduceMotion: boolean;
}) {
  const { rows, cols, duration, delay } = spec;
  const shape = useShape();
  const gap = Math.max(1, Math.round(size * 0.06));

  const n = Math.max(rows, cols);
  const cell = (size - gap * (n - 1)) / n;
  const width = cols * cell + gap * (cols - 1);
  const height = rows * cell + gap * (rows - 1);

  const cellRadius = Math.min(shape.bgRadius, cell / 2);

  return (
    <span
      aria-hidden
      className="grid"
      style={{
        width,
        height,
        gap,
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
      }}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const d = delay(r, c, rows, cols);
        const dark = d === null;

        const style: CSSProperties = {
          background: "currentColor",
          borderRadius: cellRadius,
          opacity: dark ? 0.08 : reduceMotion ? 0.5 : 0.15,
        };
        if (!dark && !reduceMotion) {
          style.animation = `loader-cell ${duration}s ease-in-out infinite`;
          style.animationDelay = `${(d * duration).toFixed(3)}s`;
        }

        return <span key={i} style={style} />;
      })}
    </span>
  );
}

const BAR_COUNT = 12;

function Bars({ size, reduceMotion }: { size: number; reduceMotion: boolean }) {
  const duration = 1.2;
  const shape = useShape();
  const barWidth = Math.max(1, Math.round(size * 0.08));
  const barHeight = Math.max(2, Math.round(size * 0.1875));
  const radius = size * 0.32;

  return (
    <span aria-hidden className="relative block" style={{ width: size, height: size }}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: barWidth,
            height: barHeight,
            borderRadius: Math.min(shape.bgRadius, barWidth / 2),
            background: "currentColor",
            transform: `translate(-50%, -50%) rotate(${i * (360 / BAR_COUNT)}deg) translateY(-${radius}px)`,
            transformOrigin: "center",
            opacity: reduceMotion ? 0.4 : undefined,
            animation: reduceMotion ? undefined : `loader-bar ${duration}s linear infinite`,
            animationDelay: reduceMotion
              ? undefined
              : `${(-(duration / BAR_COUNT) * (BAR_COUNT - i)).toFixed(3)}s`,
          }}
        />
      ))}
    </span>
  );
}

const spinnerVariants = [
  "arc", "bars", "braille", "breathe", "cascade", "checkerboard", "columns",
  "diagonal-swipe", "fill-sweep", "helix", "orbit", "pulse", "rain",
  "scan", "snake", "sparkle", "wave-rows",
] as const satisfies readonly SpinnerVariant[];

export { Spinner, spinnerVariants };
export type { SpinnerProps, SpinnerVariant };
