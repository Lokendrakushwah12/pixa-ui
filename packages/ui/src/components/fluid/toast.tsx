"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";
import { useSoundMaybe, type SoundName } from "../../components/fluid/sound";

type ToastTone = "default" | "success" | "error";

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number | null;
  action?: { label: string; onClick: () => void };
}

interface ToastRecord extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <Toaster>");
  return ctx;
}

const PEEK = 14;
const SCALE_STEP = 0.05;
const GAP = 12;
const MAX_VISIBLE = 3;

const toneSound: Record<ToastTone, SoundName> = {
  default: "open",
  success: "success",
  error: "error",
};

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

function Toaster({
  children,
  position = "bottom-right",
  max = 5,
}: {
  children?: ReactNode;
  position?: ToastPosition;
  max?: number;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const nextId = useRef(0);
  const sound = useSoundMaybe();

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    setHeights((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { ...options, id }].slice(-max));
      sound?.play(toneSound[options.tone ?? "default"]);
      return id;
    },
    [max, sound]
  );

  const reportHeight = useCallback((id: number, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  const fromTop = position.startsWith("top");
  const ordered = useMemo(() => [...toasts].reverse(), [toasts]);

  const frontHeight = ordered.length ? (heights[ordered[0].id] ?? 0) : 0;
  const expandedHeight = ordered
    .slice(0, MAX_VISIBLE)
    .reduce((sum, t, i) => sum + (heights[t.id] ?? 0) + (i ? GAP : 0), 0);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            data-slot="toaster"
            onPointerEnter={() => setExpanded(true)}
            onPointerLeave={() => setExpanded(false)}
            onFocusCapture={() => setExpanded(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false);
            }}
            className={cn(
              "pointer-events-none fixed z-[100] w-80 max-w-[calc(100vw-2rem)]",
              positionClasses[position]
            )}
            style={{
              height: ordered.length
                ? expanded
                  ? expandedHeight
                  : frontHeight + Math.min(ordered.length - 1, MAX_VISIBLE - 1) * 4
                : 0,
              transition: "height 160ms ease-out",
            }}
          >
            <AnimatePresence initial={false}>
              {ordered.slice(0, MAX_VISIBLE).map((t, depth) => (
                <ToastItem
                  key={t.id}
                  toast={t}
                  depth={depth}
                  expanded={expanded}
                  fromTop={fromTop}
                  offset={ordered
                    .slice(0, depth)
                    .reduce((sum, prev) => sum + (heights[prev.id] ?? 0) + GAP, 0)}
                  onDismiss={dismiss}
                  onHeight={reportHeight}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

const toneAccent: Record<ToastTone, string> = {
  default: "bg-muted-foreground/40",
  success: "bg-green-500",
  error: "bg-destructive",
};

function ToastItem({
  toast,
  depth,
  expanded,
  fromTop,
  offset,
  onDismiss,
  onHeight,
}: {
  toast: ToastRecord;
  depth: number;
  expanded: boolean;
  fromTop: boolean;
  offset: number;
  onDismiss: (id: number) => void;
  onHeight: (id: number, height: number) => void;
}) {
  const XIcon = useIcon("x");
  const shape = useShape();
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const duration = toast.duration === undefined ? 4000 : toast.duration;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => onHeight(toast.id, el.offsetHeight);
    report();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [toast.id, onHeight]);

  useEffect(() => {
    if (duration === null || paused || expanded) return;
    const id = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(id);
  }, [duration, paused, expanded, onDismiss, toast.id]);

  const travel = expanded ? offset : depth * PEEK;
  const y = fromTop ? travel : -travel;
  const scale = expanded ? 1 : 1 - depth * SCALE_STEP;

  return (
    <motion.div
      ref={ref}
      role={toast.tone === "error" ? "alert" : "status"}
      aria-live={toast.tone === "error" ? "assertive" : "polite"}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: fromTop ? -20 : 20, scale: 0.94 }
      }
      animate={{
        opacity: 1,
        y,
        scale,
        transition: reduceMotion ? { duration: 0 } : spring.moderate,
      }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.94, transition: spring.moderate.exit }
      }
      style={{
        position: "absolute",
        [fromTop ? "top" : "bottom"]: 0,
        left: 0,
        right: 0,
        zIndex: 100 - depth,
        transformOrigin: fromTop ? "top center" : "bottom center",
      }}
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 overflow-hidden",
        "border border-border p-3 pr-9",
        surfaceClasses(4),
        shape.container
      )}
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-0.5", toneAccent[toast.tone ?? "default"])}
      />

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-[13px] font-medium text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="text-[12px] text-muted-foreground">{toast.description}</p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className={cn(
              "mt-1.5 w-fit rounded-md text-[12px] font-medium underline underline-offset-2",
              "text-foreground outline-none transition-colors duration-100",
              "hover:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
        className={cn(
          "absolute top-2.5 right-2.5 rounded-md p-1 text-muted-foreground",
          "transition-colors duration-100 hover:text-foreground",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "[&>svg]:size-3.5"
        )}
      >
        <XIcon />
      </button>
    </motion.div>
  );
}

export { Toaster, useToast };
export type { ToastOptions, ToastTone, ToastPosition };
