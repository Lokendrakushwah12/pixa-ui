"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownContent,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from "@/registry/default/ui/dropdown";
import { MenuItem } from "@/registry/default/ui/menu-item";

export default function Particle() {
  const [checked, setChecked] = useState(0);
  const options = [
    "Spring physics",
    "Fluid hover",
    "Font weight transitions",
    "Keyboard navigation",
  ];

  return (
    <DropdownMenu>
      <DropdownTrigger
        render={<Button variant="secondary">Open dropdown</Button>}
      />
      <DropdownContent checkedIndex={checked}>
        <DropdownLabel>Motion</DropdownLabel>
        {options.map((label, i) => (
          <MenuItem
            checked={checked === i}
            index={i}
            key={label}
            label={label}
            onSelect={() => setChecked(i)}
          />
        ))}
        <DropdownSeparator />
        <MenuItem
          index={options.length}
          label="Reset"
          onSelect={() => setChecked(0)}
        />
      </DropdownContent>
    </DropdownMenu>
  );
}
