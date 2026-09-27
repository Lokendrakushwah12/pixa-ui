import { Sparkles } from "lucide-react";

import type { Config, Schema } from "@/lib/playground/schema";
import {
  Card,
  CardButton,
  CardContent,
  CardDescription,
  CardFooter,
  CardGroup,
  CardMedia,
  CardTitle,
} from "@/registry/default/ui/fluid-card";

const ITEMS = [
  { body: "File-based routes with nested layouts.", title: "Routing" },
  { body: "Requests deduped and revalidated for you.", title: "Caching" },
  {
    body: "Send the shell first, fill it in as it resolves.",
    title: "Streaming",
  },
  { body: "Tree-shaken output with per-route splitting.", title: "Bundling" },
];

export const cardSchema: Schema = {
  craft: [
    "Cards are transparent and borderless by default, unlike stock shadcn: they inherit the parent substrate and lean on hairline dividers plus the fluid hover highlight instead of a drawn frame.",
    'Only clickable cards (href/onClick) register with the group\'s fluid hover — "a highlight on an informational card would promise a click that has nowhere to land".',
    "With columns > 1 the fluid hover resolves the nearest card in two dimensions, and gap clicks route to the highlighted card only within 16px, because a card grid has generous whitespace.",
    "Hairline dividers drop next to the active OR selected card so highlight and selection fill read clean; where a bottom and right hairline meet, the vertical one stops 1px short so the horizontal line owns the crossing pixel.",
    "CardTitle reserves its bold width with an invisible ghost span and animates 'wght' 400 → 550 only for the persistent selected state — fluid hover previews via the highlight fill, not by bolding the label.",
    "Clickable cards use a stretched overlay link/button with footer actions above it — the accessible alternative to nesting interactive elements; a disabled card drops the overlay entirely so keyboard cannot reach it.",
    "CardImage and CardMedia logos paint a 1px inset image outline over their outermost pixels, so pale image edges keep their shape without a border changing the box size.",
  ],
  // An inline row lays cards out horizontally, so a column count has nothing
  // to divide; selection and hover both need a card that can be clicked.
  derive: (config: Config) => ({
    columns:
      config.orientation === "Inline" ? { locked: true, value: "1" } : {},
  }),
  groups: [
    {
      controls: [
        {
          id: "media",
          initial: "Icon",
          kind: "select",
          label: "Media",
          options: ["None", "Icon"],
        },
        {
          id: "description",
          initial: true,
          kind: "toggle",
          label: "Description",
        },
        {
          id: "primary",
          initial: false,
          kind: "toggle",
          label: "Primary button",
        },
        {
          id: "secondary",
          initial: false,
          kind: "toggle",
          label: "Secondary button",
        },
        { id: "ghost", initial: false, kind: "toggle", label: "Ghost button" },
      ],
      label: "Card",
    },
    {
      controls: [
        {
          id: "orientation",
          initial: "Card",
          kind: "select",
          label: "Orientation",
          options: ["Card", "Inline"],
        },
        {
          id: "columns",
          initial: "2",
          kind: "select",
          label: "Columns",
          options: ["1", "2", "3"],
        },
        {
          id: "border",
          initial: "None",
          kind: "select",
          label: "Border",
          options: ["None", "Outlined"],
        },
        { id: "separated", initial: false, kind: "toggle", label: "Separated" },
        {
          id: "fluidHover",
          initial: true,
          kind: "toggle",
          label: "Fluid hover",
        },
        { id: "selected", initial: false, kind: "toggle", label: "Selected" },
      ],
      label: "Card group",
    },
  ],
  name: "fluid-card",
  propDocs: [
    "onClick: () => void. Makes the whole card a clickable target (stretched button).",
    "href: string. Makes the whole card a link (stretched anchor).",
    "selected: boolean (default false). Persistent selected fill and title emphasis on top of fluid hover.",
    "disabled: boolean (default false). Dims and disables the card.",
    "dismissible: boolean (default false). Shows a dismiss button, revealed on hover or focus.",
    "onDismiss: () => void. Called when the dismiss button is pressed.",
    'CardGroup orientation: "card" | "inline" (default "card"). Stacked layout or a horizontal row.',
    "CardGroup columns: number (default 1). Grid columns; more than 1 enables 2-D fluid hover.",
    'CardGroup border: "none" | "outlined" (default "none"). Borderless with dividers, or a drawn border.',
    "CardGroup separated: boolean (default false). Individually shaped tiles with a gap instead of one divided block.",
  ],
  render: (config) => {
    const inline = config.orientation === "Inline";
    const columns = inline ? 1 : Number(config.columns);
    const count = Math.min(ITEMS.length, Math.max(2, columns * 2));
    return (
      <CardGroup
        border={config.border === "Outlined" ? "outlined" : "none"}
        className="w-full max-w-xl"
        columns={columns}
        fluidHover={Boolean(config.fluidHover)}
        orientation={inline ? "inline" : "card"}
        separated={Boolean(config.separated)}
      >
        {ITEMS.slice(0, count).map((item, i) => (
          <Card
            index={i}
            key={item.title}
            onClick={() => undefined}
            selected={Boolean(config.selected) && i === 0}
          >
            {config.media === "Icon" ? <CardMedia icon={Sparkles} /> : null}
            <CardContent>
              <CardTitle>{item.title}</CardTitle>
              {config.description ? (
                <CardDescription>{item.body}</CardDescription>
              ) : null}
            </CardContent>
            {config.primary || config.secondary || config.ghost ? (
              <CardFooter>
                {config.primary ? (
                  <CardButton variant="primary">Enable</CardButton>
                ) : null}
                {config.secondary ? (
                  <CardButton variant="secondary">Details</CardButton>
                ) : null}
                {config.ghost ? (
                  <CardButton variant="ghost">Dismiss</CardButton>
                ) : null}
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </CardGroup>
    );
  },
  summary:
    "shadcn's compositional card, dressed in pixa ui: stacked, inline, and grid layouts, borderless dividers, and 2-D fluid hover. Needs a shadcn-style project: Tailwind v4, the `@/` alias, and the Inter variable font loaded for the weight animations.",
  title: "Card",
};
