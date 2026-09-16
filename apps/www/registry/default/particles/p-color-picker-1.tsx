"use client";

import { useState } from "react";
import { ColorPicker } from "@/registry/default/ui/color-picker";

export default function Particle() {
  const [color, setColor] = useState("#2a78d6");
  return (
    <>
      <ColorPicker onValueChange={(v) => setColor(v)} value={color} />
      <span className="flex items-center gap-2 text-[13px]">
        <span
          aria-hidden
          className="size-5 rounded-md border border-border"
          style={{ background: color }}
        />
        <code className="font-mono text-[12px]">{color}</code>
      </span>
    </>
  );
}
