import type { Registry } from "shadcn/schema";

export const styles: Registry["items"] = [
  {
    cssVars: {
      dark: {
        accent: "--alpha(var(--color-white) / 4%)",
        "accent-foreground": "var(--color-neutral-100)",
        background:
          "color-mix(in srgb, var(--color-neutral-950) 95%, var(--color-white))",
        border: "--alpha(var(--color-white) / 6%)",
        card: "color-mix(in srgb, var(--background) 98%, var(--color-white))",
        "card-foreground": "var(--color-neutral-100)",
        destructive:
          "color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))",
        "destructive-foreground": "var(--color-red-400)",
        foreground: "var(--color-neutral-100)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-400)",
        input: "--alpha(var(--color-white) / 8%)",
        muted: "--alpha(var(--color-white) / 4%)",
        "muted-foreground":
          "color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-white))",
        popover:
          "color-mix(in srgb, var(--background) 98%, var(--color-white))",
        "popover-foreground": "var(--color-neutral-100)",
        primary: "var(--color-neutral-100)",
        "primary-foreground": "var(--color-neutral-800)",
        ring: "var(--color-neutral-500)",
        secondary: "--alpha(var(--color-white) / 4%)",
        "secondary-foreground": "var(--color-neutral-100)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-400)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-400)",
      },
      light: {
        accent: "--alpha(var(--color-black) / 4%)",
        "accent-foreground": "var(--color-neutral-800)",
        background: "var(--color-white)",
        border: "--alpha(var(--color-black) / 8%)",
        card: "var(--color-white)",
        "card-foreground": "var(--color-neutral-800)",
        destructive: "var(--color-red-500)",
        "destructive-foreground": "var(--color-red-700)",
        foreground: "var(--color-neutral-800)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-700)",
        input: "--alpha(var(--color-black) / 10%)",
        muted: "--alpha(var(--color-black) / 4%)",
        "muted-foreground":
          "color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-black))",
        popover: "var(--color-white)",
        "popover-foreground": "var(--color-neutral-800)",
        primary: "var(--color-neutral-800)",
        "primary-foreground": "var(--color-neutral-50)",
        ring: "var(--color-neutral-400)",
        secondary: "--alpha(var(--color-black) / 4%)",
        "secondary-foreground": "var(--color-neutral-800)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-700)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-700)",
      },
    },
    name: "colors-neutral",
    type: "registry:style",
  },
];
