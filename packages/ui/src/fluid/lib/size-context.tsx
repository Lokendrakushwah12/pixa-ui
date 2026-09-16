"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type SizeVariant = "default" | "compact";

interface SizeClasses {
  variant: SizeVariant;
  control: string;
  controlHeight: number;
  segmentItem: string;
  segmentPad: string;
  text: string;
  px: string;
  itemPx: string;
  gap: string;
  icon: number;
}

const sizeMap: Record<SizeVariant, SizeClasses> = {
  default: {
    variant: "default",
    control: "h-9",
    controlHeight: 36,
    segmentItem: "h-7",
    segmentPad: "p-1",
    text: "text-[13px]",
    px: "px-3",
    itemPx: "px-2",
    gap: "gap-2",
    icon: 16,
  },
  compact: {
    variant: "compact",
    control: "h-7",
    controlHeight: 28,
    segmentItem: "h-6",
    segmentPad: "p-0.5",
    text: "text-[12px]",
    px: "px-2.5",
    itemPx: "px-1.5",
    gap: "gap-1",
    icon: 14,
  },
};

interface TypeScaleStep {
  default: number;
  compact: number;
}

const typeScale = {
  display: { default: 28, compact: 24 },
  title: { default: 16, compact: 15 },
  subtitle: { default: 14, compact: 13 },
  body: { default: 13, compact: 12 },
  caption: { default: 12, compact: 11 },
} as const satisfies Record<string, TypeScaleStep>;

type TypeScaleRole = keyof typeof typeScale;

function useTypeScale(
  override?: SizeVariant | null
): Record<TypeScaleRole, number> {
  const variant = useSizeVariant(override);
  return {
    display: typeScale.display[variant],
    title: typeScale.title[variant],
    subtitle: typeScale.subtitle[variant],
    body: typeScale.body[variant],
    caption: typeScale.caption[variant],
  };
}

interface SizeContextValue {
  size: SizeVariant;
  setSize: (size: SizeVariant) => void;
  classes: SizeClasses;
}

const SizeContext = createContext<SizeContextValue | null>(null);

function useSizeVariant(override?: SizeVariant | null): SizeVariant {
  const ctx = useContext(SizeContext);
  return override ?? ctx?.size ?? "default";
}

function useSize(override?: SizeVariant | null): SizeClasses {
  return sizeMap[useSizeVariant(override)];
}

function useSizeContext() {
  const ctx = useContext(SizeContext);
  if (!ctx) throw new Error("useSizeContext must be used within a SizeProvider");
  return ctx;
}

function SizeProvider({
  children,
  size,
  defaultSize = "default",
}: {
  children: ReactNode;
  size?: SizeVariant;
  defaultSize?: SizeVariant;
}) {
  const [internalSize, setInternalSize] = useState<SizeVariant>(defaultSize);
  const isControlled = size !== undefined;
  const resolved = size ?? internalSize;

  const setSize = useCallback(
    (next: SizeVariant) => {
      if (isControlled) return;
      setInternalSize(next);
    },
    [isControlled]
  );

  const value = useMemo(
    () => ({ size: resolved, setSize, classes: sizeMap[resolved] }),
    [resolved, setSize]
  );

  return <SizeContext.Provider value={value}>{children}</SizeContext.Provider>;
}

export {
  SizeProvider,
  useSize,
  useSizeVariant,
  useSizeContext,
  useTypeScale,
  sizeMap,
  typeScale,
};
export type { SizeVariant, SizeClasses, TypeScaleRole, TypeScaleStep };
