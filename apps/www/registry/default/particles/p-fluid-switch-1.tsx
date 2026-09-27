"use client";

import { useState } from "react";
import { Switch } from "@/registry/default/ui/fluid-switch";

export default function Particle() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <>
      <Switch checked={a} label="On" onToggle={() => setA((v) => !v)} />
      <Switch checked={b} label="Off" onToggle={() => setB((v) => !v)} />

      <Switch checked={false} disabled label="Disabled" onToggle={() => {}} />
      <Switch
        checked={a}
        label="Compact"
        onToggle={() => setA((v) => !v)}
        size="compact"
      />
    </>
  );
}
