"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import type { Config, Schema } from "@/lib/playground/schema";
import {
  Combobox,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/default/ui/fluid-combobox";

const FRAMEWORKS = [
  "Next.js",
  "Astro",
  "Remix",
  "Nuxt",
  "SvelteKit",
  "SolidStart",
];

/** Own the value so the preview behaves like a real field, not a static shot. */
function ComboboxPreview({ config }: { config: Config }) {
  const multiple = Boolean(config.multiple);
  const [single, setSingle] = useState<string>("Next.js");
  const [many, setMany] = useState<string[]>(["Astro", "Remix"]);
  const [items, setItems] = useState<string[]>([...FRAMEWORKS]);

  const Field = multiple ? ComboboxChips : ComboboxInput;

  return (
    <div className="w-72">
      <Combobox
        disabled={Boolean(config.disabled)}
        hideSelected={Boolean(config.hideSelected)}
        items={items}
        key={multiple ? "multi" : "single"}
        multiple={multiple as never}
        onCreate={
          config.create
            ? (query: string) => {
                setItems((prev) =>
                  prev.includes(query) ? prev : [...prev, query],
                );
                return query;
              }
            : undefined
        }
        onValueChange={
          (multiple ? setMany : setSingle) as (v: string | string[]) => void
        }
        value={(multiple ? many : single) as never}
      >
        <Field
          clearable={Boolean(config.clearable)}
          error={config.error ? "Pick a supported framework" : undefined}
          icon={config.leadingIcon ? Search : undefined}
          placeholder="Search frameworks…"
          variant={config.variant === "Borderless" ? "borderless" : "bordered"}
        />
        <ComboboxContent>
          <ComboboxList>
            {(item) => {
              const value = typeof item === "string" ? item : item.value;
              const label = typeof item === "string" ? item : item.label;
              return (
                <ComboboxItem key={value} value={value}>
                  {label}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export const comboboxSchema: Schema = {
  craft: [
    "The list highlight glides to the nearest row rather than snapping, and the keyboard and pointer share one highlight so arrowing and hovering never disagree.",
    "The popup is anchored to the field rather than the trigger, so it keeps the field's width as chips wrap it onto a second line.",
    "Typing filters on the next frame rather than per keystroke, so a fast typist never sees the list reflow mid-word.",
    "An empty result keeps the popup open with its own row instead of closing — a popup that vanishes mid-type reads as a dropped keystroke.",
  ],
  // Only a multi-select has picked rows to hide from the list.
  derive: (config: Config) =>
    config.multiple ? {} : { hideSelected: { locked: true, value: false } },
  groups: [
    {
      controls: [
        { id: "multiple", initial: true, kind: "toggle", label: "Multiple" },
        {
          id: "create",
          initial: false,
          kind: "toggle",
          label: "Create from query",
        },
        {
          id: "hideSelected",
          initial: false,
          kind: "toggle",
          label: "Hide picked rows",
        },
      ],
      label: "Combobox",
    },
    {
      controls: [
        {
          id: "variant",
          initial: "Bordered",
          kind: "select",
          label: "Variant",
          options: ["Bordered", "Borderless"],
        },
        {
          id: "leadingIcon",
          initial: false,
          kind: "toggle",
          label: "Leading icon",
        },
        {
          id: "clearable",
          initial: false,
          kind: "toggle",
          label: "Clear button",
        },
        { id: "error", initial: false, kind: "toggle", label: "Error" },
        { id: "disabled", initial: false, kind: "toggle", label: "Disabled" },
      ],
      label: "Field",
    },
  ],
  name: "fluid-combobox",
  propDocs: [
    "items: the rows to filter. Strings, or objects with value and label.",
    "multiple: boolean (default false). Chips and an array value instead of a single string.",
    "onCreate: (query) => item. Offers the current query as a new row when nothing matches.",
    "hideSelected: boolean (default false). Drops already-picked rows from the list.",
    'ComboboxInput / ComboboxChips variant: "bordered" | "borderless" (default "bordered").',
    "icon / clearable / error / disabled: field affordances on either input.",
  ],
  render: (config) => <ComboboxPreview config={config} />,
  summary:
    "A filtering combobox with chips, create-from-query, and a highlight shared between pointer and keyboard.",
  title: "Combobox",
};
