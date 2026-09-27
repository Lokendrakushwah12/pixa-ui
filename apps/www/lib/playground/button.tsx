import { ArrowRight, Sparkles } from "lucide-react";

import type { Config, Schema } from "@/lib/playground/schema";
import { Button } from "@/registry/default/ui/button";

const VARIANTS: Record<string, string> = {
  Destructive: "destructive",
  Ghost: "ghost",
  Outline: "outline",
  Primary: "primary",
  Secondary: "secondary",
};

const SIZES: Record<string, string> = {
  Default: "default",
  "Extra large": "xl",
  "Extra small": "xs",
  Large: "lg",
  Small: "sm",
};

const ICON_SIZES: Record<string, string> = {
  Default: "icon",
  "Extra large": "icon-xl",
  "Extra small": "icon-xs",
  Large: "icon-lg",
  Small: "icon-sm",
};

export const buttonSchema: Schema = {
  craft: [
    "The press response is geometric rather than a transform: the surface collapses its inset by 1px, so a button in a group does not visibly shrink away from its neighbours.",
    "Inside a ButtonGroup the press-collapse is stripped and the radius is squared on the inner edges, so adjoining buttons share one border instead of stacking two.",
    "A bevel highlight sits on the top border rather than a pixel below it, so the lit edge and the border are the same line.",
    "The label is wrapped so an icon and text sit on one row; a string label is trimmed to its cap height, which keeps mixed icon/text buttons optically centred.",
  ],
  // An icon-only button has no label for an icon to lead or trail.
  derive: (config: Config) =>
    config.iconOnly
      ? {
          leading: { locked: true, value: false },
          trailing: { locked: true, value: false },
        }
      : {},
  groups: [
    {
      controls: [
        {
          id: "variant",
          initial: "Primary",
          kind: "select",
          label: "Variant",
          options: ["Primary", "Secondary", "Outline", "Ghost", "Destructive"],
        },
        {
          id: "size",
          initial: "Default",
          kind: "select",
          label: "Size",
          options: ["Extra small", "Small", "Default", "Large", "Extra large"],
        },
        { id: "iconOnly", initial: false, kind: "toggle", label: "Icon only" },
        {
          id: "leading",
          initial: false,
          kind: "toggle",
          label: "Leading icon",
        },
        {
          id: "trailing",
          initial: false,
          kind: "toggle",
          label: "Trailing icon",
        },
      ],
      label: "Button",
    },
    {
      controls: [
        { id: "loading", initial: false, kind: "toggle", label: "Loading" },
        { id: "active", initial: false, kind: "toggle", label: "Active" },
        { id: "disabled", initial: false, kind: "toggle", label: "Disabled" },
      ],
      label: "State",
    },
  ],
  name: "button",
  propDocs: [
    'variant: "primary" | "secondary" | "outline" | "ghost" | "destructive" (default "primary").',
    'size: "xs" | "sm" | "default" | "lg" | "xl", plus the icon-only ladder "icon-xs" … "icon-xl" (default "default").',
    "loading: boolean (default false). Swaps the label for a spinner and blocks the press.",
    "leadingIcon / trailingIcon: a component rendered beside the label.",
    "active: boolean (default false). Holds the pressed surface, for a toggled control.",
    "asChild / render: render the button as a link or another element.",
  ],
  render: (config) => {
    const iconOnly = Boolean(config.iconOnly);
    return (
      <Button
        active={Boolean(config.active)}
        disabled={Boolean(config.disabled)}
        leadingIcon={config.leading ? Sparkles : undefined}
        loading={Boolean(config.loading)}
        size={
          (iconOnly
            ? ICON_SIZES[String(config.size)]
            : SIZES[String(config.size)]) as "default"
        }
        trailingIcon={config.trailing ? ArrowRight : undefined}
        variant={
          VARIANTS[String(config.variant)] as
            | "primary"
            | "secondary"
            | "outline"
            | "ghost"
            | "destructive"
        }
      >
        {iconOnly ? <Sparkles /> : "Get started"}
      </Button>
    );
  },
  summary:
    "The pixa ui button: five variants, a geometric press, group-aware borders, and icon slots that stay optically centred.",
  title: "Button",
};
