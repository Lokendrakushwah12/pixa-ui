"use client";

import { LayerMask01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@pixa/ui/components/button";
import { useTheme } from "@pixa/ui/shared/theme-provider";
import * as React from "react";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      className="relative size-8"
      onClick={toggleTheme}
      size="icon"
      title="Toggle theme"
      variant="ghost"
    >
      <HugeiconsIcon
        className="size-4 -rotate-45"
        icon={LayerMask01Icon}
        strokeWidth={2}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
