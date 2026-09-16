"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type ShapeVariant = "sharp" | "rounded-sm" | "rounded" | "pill";

interface ShapeClasses {
  variant: ShapeVariant;
  item: string;
  bg: string;
  focusRing: string;
  mergedBg: string;
  container: string;
  button: string;
  input: string;
  bgRadius: number;
  mergedRadius: number;
}

const shapeMap: Record<ShapeVariant, ShapeClasses> = {
  pill: {
    variant: "pill",
    item: "rounded-[20px]",
    bg: "rounded-[20px]",
    focusRing: "rounded-[22px]",
    mergedBg: "rounded-2xl",
    container: "rounded-3xl",
    button: "rounded-[20px]",
    input: "rounded-[20px]",
    bgRadius: 20,
    mergedRadius: 16,
  },
  sharp: {
    variant: "sharp",
    item: "rounded-none",
    bg: "rounded-none",
    focusRing: "rounded-none",
    mergedBg: "rounded-none",
    container: "rounded-none",
    button: "rounded-none",
    input: "rounded-none",
    bgRadius: 0,
    mergedRadius: 0,
  },
  "rounded-sm": {
    variant: "rounded-sm",
    item: "rounded",
    bg: "rounded",
    focusRing: "rounded-md",
    mergedBg: "rounded",
    container: "rounded-md",
    button: "rounded",
    input: "rounded",
    bgRadius: 4,
    mergedRadius: 4,
  },
  rounded: {
    variant: "rounded",
    item: "rounded-lg",
    bg: "rounded-lg",
    focusRing: "rounded-[10px]",
    mergedBg: "rounded-lg",
    container: "rounded-xl",
    button: "rounded-lg",
    input: "rounded-lg",
    bgRadius: 8,
    mergedRadius: 8,
  },
};

interface ShapeContextValue {
  shape: ShapeVariant;
  setShape: (shape: ShapeVariant) => void;
  classes: ShapeClasses;
}

const ShapeContext = createContext<ShapeContextValue | null>(null);

function useShape(): ShapeClasses {
  const ctx = useContext(ShapeContext);
  if (!ctx) return shapeMap.rounded;
  return ctx.classes;
}

function usePopupShape(): ShapeClasses {
  const shape = useShape();
  return shape.variant === "pill" ? shapeMap.rounded : shape;
}

function useShapeContext() {
  const ctx = useContext(ShapeContext);
  if (!ctx) throw new Error("useShapeContext must be used within a ShapeProvider");
  return ctx;
}

const SHAPE_STORAGE_KEY = "fluid-ui:shape";

function ShapeProvider({
  children,
  defaultShape = "rounded",
}: {
  children: ReactNode;
  defaultShape?: ShapeVariant;
}) {
  const [shape, setShapeState] = useState<ShapeVariant>(defaultShape);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transitionShape = useCallback((callback: () => void) => {
    const root = document.documentElement;
    root.classList.add("transitioning");
    void root.offsetHeight;
    callback();
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(
      () => root.classList.remove("transitioning"),
      200
    );
  }, []);

  const setShape = useCallback(
    (next: ShapeVariant) => {
      transitionShape(() => setShapeState(next));
      try {
        localStorage.setItem(SHAPE_STORAGE_KEY, next);
      } catch {
        // Private windows and blocked site data throw outright; the shape
        // still applies for this session, it just won't be remembered.
      }
    },
    [transitionShape]
  );

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(SHAPE_STORAGE_KEY);
    } catch {
      return;
    }
    if (saved && saved in shapeMap) setShapeState(saved as ShapeVariant);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shape-input-radius",
      `${shapeMap[shape].bgRadius}px`
    );
  }, [shape]);

  const value = useMemo(
    () => ({ shape, setShape, classes: shapeMap[shape] }),
    [shape, setShape]
  );

  return (
    <ShapeContext.Provider value={value}>
      {children}
    </ShapeContext.Provider>
  );
}

export { ShapeProvider, useShape, usePopupShape, useShapeContext, shapeMap };
export type { ShapeVariant, ShapeClasses };
