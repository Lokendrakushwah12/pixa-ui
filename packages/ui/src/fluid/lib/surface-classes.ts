export const SURFACE_BG: Record<number, string> = {
  1: "bg-surface-1",
  2: "bg-surface-2",
  3: "bg-surface-3",
  4: "bg-surface-4",
  5: "bg-surface-5",
  6: "bg-surface-6",
  7: "bg-surface-7",
  8: "bg-surface-8",
};

export const SURFACE_SHADOW: Record<number, string> = {
  1: "shadow-surface-1",
  2: "shadow-surface-2",
  3: "shadow-surface-3",
  4: "shadow-surface-4",
  5: "shadow-surface-5",
  6: "shadow-surface-6",
  7: "shadow-surface-7",
  8: "shadow-surface-8",
};

export const SURFACE_HOVER_BG: Record<number, string> = {
  1: "hover:bg-surface-1",
  2: "hover:bg-surface-2",
  3: "hover:bg-surface-3",
  4: "hover:bg-surface-4",
  5: "hover:bg-surface-5",
  6: "hover:bg-surface-6",
  7: "hover:bg-surface-7",
  8: "hover:bg-surface-8",
};

export const SURFACE_HOVER_SHADOW: Record<number, string> = {
  1: "hover:shadow-surface-1",
  2: "hover:shadow-surface-2",
  3: "hover:shadow-surface-3",
  4: "hover:shadow-surface-4",
  5: "hover:shadow-surface-5",
  6: "hover:shadow-surface-6",
  7: "hover:shadow-surface-7",
  8: "hover:shadow-surface-8",
};

export function surfaceClasses(bgLevel: number, shadowLevel: number = bgLevel): string {
  const bg = Math.round(Math.max(1, Math.min(8, bgLevel)));
  const shadow = Math.round(Math.max(1, Math.min(8, shadowLevel)));
  return `${SURFACE_BG[bg]} ${SURFACE_SHADOW[shadow]}`;
}

export function surfaceHoverClasses(
  bgLevel: number,
  shadowLevel: number = bgLevel
): string {
  const bg = Math.round(Math.max(1, Math.min(8, bgLevel)));
  const shadow = Math.round(Math.max(1, Math.min(8, shadowLevel)));
  return `${SURFACE_HOVER_BG[bg]} ${SURFACE_HOVER_SHADOW[shadow]}`;
}
