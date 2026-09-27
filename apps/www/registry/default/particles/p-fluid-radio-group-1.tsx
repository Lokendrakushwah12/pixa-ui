"use client";

import { useState } from "react";
import { RadioGroup, RadioItem } from "@/registry/default/ui/fluid-radio-group";

export default function Particle() {
  const [selected, setSelected] = useState(1);
  return (
    <RadioGroup selectedIndex={selected}>
      {["Fast spring", "Moderate spring", "Slow spring", "No animation"].map(
        (label, i) => (
          <RadioItem
            index={i}
            key={label}
            label={label}
            onSelect={() => setSelected(i)}
            selected={selected === i}
          />
        ),
      )}
    </RadioGroup>
  );
}
