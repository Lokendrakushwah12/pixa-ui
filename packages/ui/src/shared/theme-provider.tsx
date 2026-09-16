"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "theme";

// Runs before paint on the client (StrictMode re-apply); falls back to useEffect
// during SSR to avoid the "useLayoutEffect does nothing on the server" warning.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function systemPref(): Resolved {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolve(theme: Theme): Resolved {
  return theme === "system" ? systemPref() : theme;
}

function apply(resolved: Resolved) {
  const el = document.documentElement;
  el.classList.toggle("dark", resolved === "dark");
  el.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<Resolved>("light");

  // Read the stored preference and re-apply the class. The inline <head> script
  // already set it before paint; this also restores it after StrictMode's dev
  // remount resets <html>. No-op-safe in production.
  useIsomorphicLayoutEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
    const resolved = resolve(stored);
    setThemeState(stored);
    setResolvedTheme(resolved);
    apply(resolved);
  }, []);

  // Follow the OS while in "system" mode.
  React.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = systemPref();
      setResolvedTheme(resolved);
      apply(resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    const resolved = resolve(next);
    setThemeState(next);
    setResolvedTheme(resolved);
    apply(resolved);
  }, []);

  const value = React.useMemo(
    () => ({ resolvedTheme, setTheme, theme }),
    [resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
