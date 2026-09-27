"use client";

import { useState } from "react";
import {
  CheckboxGroup,
  CheckboxItem,
} from "@/registry/default/ui/fluid-checkbox-group";

export default function Particle() {
  const [checked, setChecked] = useState(new Set<number>([0, 1]));
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });

  return (
    <CheckboxGroup checkedIndices={checked}>
      {[
        "Spring animations",
        "Fluid hover",
        "Font weight shifts",
        "Keyboard navigation",
      ].map((label, i) => (
        <CheckboxItem
          checked={checked.has(i)}
          index={i}
          key={label}
          label={label}
          onToggle={() => toggle(i)}
        />
      ))}
    </CheckboxGroup>
  );
}
