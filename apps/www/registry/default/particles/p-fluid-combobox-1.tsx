"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/default/ui/fluid-combobox";

const frameworks = [
  "Next.js",
  "Remix",
  "Astro",
  "SvelteKit",
  "Nuxt",
  "SolidStart",
];

export default function Particle() {
  const [single, setSingle] = useState("Next.js");
  const [many, setMany] = useState<string[]>(["Astro"]);

  return (
    <>
      <div className="w-64">
        <Combobox items={frameworks} onValueChange={setSingle} value={single}>
          <ComboboxInput placeholder="Pick one…" />
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
          </ComboboxContent>
        </Combobox>
      </div>
      <div className="w-64">
        <Combobox
          items={frameworks}
          multiple={true}
          onValueChange={setMany}
          value={many}
        >
          <ComboboxInput placeholder="Pick several…" />
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
          </ComboboxContent>
        </Combobox>
      </div>
    </>
  );
}
