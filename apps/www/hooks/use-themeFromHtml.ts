import { useEffect, useState } from "react";

export function useThemeFromHtml() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const el = document.documentElement;

    const update = () => {
      setTheme(el.classList.contains("dark") ? "dark" : "light");
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(el, { attributeFilter: ["class"], attributes: true });

    return () => observer.disconnect();
  }, []);

  return theme;
}
