"use client";

import { useState } from "react";
import { InputDissolve } from "@/registry/default/ui/input-dissolve";

export default function Particle() {
  const [value, setValue] = useState("Press Escape");
  return (
    <div className="w-64">
      <InputDissolve
        label="Search"
        onChange={setValue}
        placeholder="Type, then Escape"
        value={value}
      />
    </div>
  );
}
