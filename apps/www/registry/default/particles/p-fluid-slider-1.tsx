"use client";

import { useState } from "react";
import { Slider } from "@/registry/default/ui/fluid-slider";

export default function Particle() {
  const [single, setSingle] = useState(60);
  const [range, setRange] = useState<[number, number]>([20, 70]);
  return (
    <>
      <div className="w-64">
        <Slider
          max={100}
          min={0}
          onChange={(v) => setSingle(v as number)}
          value={single}
        />
      </div>
      <div className="w-64">
        <Slider
          max={100}
          min={0}
          onChange={(v) => setRange(v as [number, number])}
          value={range}
        />
      </div>
      <div className="w-64">
        <Slider
          onChange={(v) => setSingle(v as number)}
          showSteps
          steps={[0, 25, 50, 75, 100]}
          value={single}
        />
      </div>
    </>
  );
}
