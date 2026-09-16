"use client";

import { useState } from "react";
import { AspectRatio } from "@/registry/default/ui/aspect-ratio";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  const [ratio, setRatio] = useState(16 / 9);
  const options = [
    { label: "16 : 9", value: 16 / 9 },
    { label: "4 : 3", value: 4 / 3 },
    { label: "1 : 1", value: 1 },
  ];
  return (
    <>
      {options.map((o) => (
        <Button
          key={o.label}
          onClick={() => setRatio(o.value)}
          size="compact"
          variant={ratio === o.value ? "primary" : "outline"}
        >
          {o.label}
        </Button>
      ))}
      <div className="w-56">
        <AspectRatio ratio={ratio}>
          <div className="flex size-full items-center justify-center rounded-lg bg-muted text-[12px] text-muted-foreground">
            {options.find((o) => o.value === ratio)?.label}
          </div>
        </AspectRatio>
      </div>
    </>
  );
}
