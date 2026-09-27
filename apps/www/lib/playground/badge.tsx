import type { Schema } from "@/lib/playground/schema";
import { Badge } from "@/registry/default/ui/fluid-badge";

const COLORS = [
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

export const badgeSchema: Schema = {
  craft: [
    "Colours are resolved from one palette table rather than Tailwind class strings, so a badge keeps its colour under a runtime theme change that rewrites the tokens.",
    "The dot variant borrows the border from the surface rather than the colour, so a row of mixed badges reads as one set instead of seventeen outlines.",
    "Gray falls back to the muted foreground rather than a fixed grey, so it tracks the theme instead of fighting it.",
  ],
  groups: [
    {
      controls: [
        {
          id: "variant",
          initial: "Solid",
          kind: "select",
          label: "Variant",
          options: ["Solid", "Dot"],
        },
        {
          id: "size",
          initial: "Default",
          kind: "select",
          label: "Size",
          options: ["Default", "Compact"],
        },
        {
          id: "palette",
          initial: true,
          kind: "toggle",
          label: "Show the palette",
        },
      ],
    },
  ],
  name: "fluid-badge",
  propDocs: [
    'variant: "solid" | "dot" (default "solid"). A filled chip, or an outlined one with a coloured dot.',
    'color: one of the 17 palette names, "gray" through "rose" (default "gray").',
    'size: "default" | "compact" (default "default").',
  ],
  render: (config) => {
    const variant = config.variant === "Dot" ? "dot" : "solid";
    const size = config.size === "Compact" ? "compact" : "default";
    const shown = config.palette ? COLORS : COLORS.slice(0, 1);
    return (
      <div className="flex max-w-lg flex-wrap items-center justify-center gap-2">
        {shown.map((color) => (
          <Badge color={color} key={color} size={size} variant={variant}>
            {color}
          </Badge>
        ))}
      </div>
    );
  },
  summary:
    "A badge with a 17-colour palette and two variants, resolved from tokens rather than class strings.",
  title: "Badge",
};
