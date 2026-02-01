import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    name: "ui",
    registryDependencies: [
      "@pixa/accordion",
      "@pixa/alert",
      "@pixa/alert-dialog",
      "@pixa/autocomplete",
      "@pixa/avatar",
      "@pixa/badge",
      "@pixa/breadcrumb",
      "@pixa/button",
      "@pixa/card",
      "@pixa/checkbox",
      "@pixa/checkbox-group",
      "@pixa/collapsible",
      "@pixa/combobox",
      "@pixa/command",
      "@pixa/dialog",
      "@pixa/empty",
      "@pixa/field",
      "@pixa/fieldset",
      "@pixa/form",
      "@pixa/frame",
      "@pixa/group",
      "@pixa/input",
      "@pixa/input-group",
      "@pixa/kbd",
      "@pixa/label",
      "@pixa/menu",
      "@pixa/meter",
      "@pixa/number-field",
      "@pixa/pagination",
      "@pixa/popover",
      "@pixa/preview-card",
      "@pixa/progress",
      "@pixa/radio-group",
      "@pixa/scroll-area",
      "@pixa/select",
      "@pixa/separator",
      "@pixa/sheet",
      "@pixa/sidebar",
      "@pixa/skeleton",
      "@pixa/slider",
      "@pixa/spinner",
      "@pixa/switch",
      "@pixa/table",
      "@pixa/tabs",
      "@pixa/textarea",
      "@pixa/toast",
      "@pixa/toggle",
      "@pixa/toggle-group",
      "@pixa/toolbar",
      "@pixa/tooltip",
    ],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/accordion.tsx",
        type: "registry:ui",
      },
    ],
    name: "accordion",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-400)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-400)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-700)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-700)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-700)",
      },
    },
    files: [
      {
        path: "ui/alert.tsx",
        type: "registry:ui",
      },
    ],
    name: "alert",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "registry:ui",
      },
    ],
    name: "alert-dialog",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/autocomplete.tsx",
        type: "registry:ui",
      },
    ],
    name: "autocomplete",
    registryDependencies: ["@pixa/input", "@pixa/scroll-area"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/avatar.tsx",
        type: "registry:ui",
      },
    ],
    name: "avatar",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-400)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-400)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-700)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-700)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/badge.tsx",
        type: "registry:ui",
      },
    ],
    name: "badge",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/breadcrumb.tsx",
        type: "registry:ui",
      },
    ],
    name: "breadcrumb",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    name: "button",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
      },
    ],
    name: "card",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/checkbox.tsx",
        type: "registry:ui",
      },
    ],
    name: "checkbox",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/checkbox-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "checkbox-group",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/collapsible.tsx",
        type: "registry:ui",
      },
    ],
    name: "collapsible",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/combobox.tsx",
        type: "registry:ui",
      },
    ],
    name: "combobox",
    registryDependencies: ["@pixa/input", "@pixa/scroll-area"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/command.tsx",
        type: "registry:ui",
      },
    ],
    name: "command",
    registryDependencies: ["@pixa/autocomplete"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/dialog.tsx",
        type: "registry:ui",
      },
    ],
    name: "dialog",
    registryDependencies: ["@pixa/button", "@pixa/scroll-area"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/empty.tsx",
        type: "registry:ui",
      },
    ],
    name: "empty",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/field.tsx",
        type: "registry:ui",
      },
    ],
    name: "field",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/fieldset.tsx",
        type: "registry:ui",
      },
    ],
    name: "fieldset",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/form.tsx",
        type: "registry:ui",
      },
    ],
    name: "form",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/frame.tsx",
        type: "registry:ui",
      },
    ],
    name: "frame",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/group.tsx",
        type: "registry:ui",
      },
    ],
    name: "group",
    registryDependencies: ["@pixa/separator"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/input.tsx",
        type: "registry:ui",
      },
    ],
    name: "input",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/input-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "input-group",
    registryDependencies: ["@pixa/input", "@pixa/textarea"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/kbd.tsx",
        type: "registry:ui",
      },
    ],
    name: "kbd",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/label.tsx",
        type: "registry:ui",
      },
    ],
    name: "label",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/menu.tsx",
        type: "registry:ui",
      },
    ],
    name: "menu",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/meter.tsx",
        type: "registry:ui",
      },
    ],
    name: "meter",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/number-field.tsx",
        type: "registry:ui",
      },
    ],
    name: "number-field",
    registryDependencies: ["@pixa/label"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/pagination.tsx",
        type: "registry:ui",
      },
    ],
    name: "pagination",
    registryDependencies: ["@pixa/button"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/popover.tsx",
        type: "registry:ui",
      },
    ],
    name: "popover",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/preview-card.tsx",
        type: "registry:ui",
      },
    ],
    name: "preview-card",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/progress.tsx",
        type: "registry:ui",
      },
    ],
    name: "progress",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/radio-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "radio-group",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "registry:ui",
      },
    ],
    name: "scroll-area",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
      },
    ],
    name: "select",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
      },
    ],
    name: "separator",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/sheet.tsx",
        type: "registry:ui",
      },
    ],
    name: "sheet",
    registryDependencies: ["@pixa/button", "@pixa/scroll-area"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/sidebar.tsx",
        type: "registry:ui",
      },
    ],
    name: "sidebar",
    registryDependencies: [
      "@pixa/button",
      "@pixa/input",
      "@pixa/scroll-area",
      "@pixa/separator",
      "@pixa/sheet",
      "@pixa/skeleton",
      "@pixa/tooltip",
      "@pixa/use-mobile",
    ],
    type: "registry:ui",
  },
  {
    css: {
      "@keyframes skeleton": {
        to: {
          "background-position": "-200% 0",
        },
      },
    },
    cssVars: {
      theme: {
        "--animate-skeleton": "skeleton 2s -1s infinite linear",
      },
    },
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
    ],
    name: "skeleton",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/slider.tsx",
        type: "registry:ui",
      },
    ],
    name: "slider",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/spinner.tsx",
        type: "registry:ui",
      },
    ],
    name: "spinner",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/switch.tsx",
        type: "registry:ui",
      },
    ],
    name: "switch",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/table.tsx",
        type: "registry:ui",
      },
    ],
    name: "table",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/tabs.tsx",
        type: "registry:ui",
      },
    ],
    name: "tabs",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/textarea.tsx",
        type: "registry:ui",
      },
    ],
    name: "textarea",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toast.tsx",
        type: "registry:ui",
      },
    ],
    name: "toast",
    registryDependencies: ["@pixa/button"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toggle.tsx",
        type: "registry:ui",
      },
    ],
    name: "toggle",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toggle-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "toggle-group",
    registryDependencies: ["@pixa/separator", "@pixa/toggle"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toolbar.tsx",
        type: "registry:ui",
      },
    ],
    name: "toolbar",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/tooltip.tsx",
        type: "registry:ui",
      },
    ],
    name: "tooltip",
    type: "registry:ui",
  },
];
