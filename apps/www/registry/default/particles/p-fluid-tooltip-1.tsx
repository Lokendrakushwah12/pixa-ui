"use client";

import { Button } from "@/registry/default/ui/button";
import { Tooltip, TooltipProvider } from "@/registry/default/ui/fluid-tooltip";

export default function Particle() {
  return (
    <TooltipProvider>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip content={`Anchored ${side}`} key={side} side={side}>
          <Button size="compact" variant="secondary">
            {side}
          </Button>
        </Tooltip>
      ))}
      <Tooltip content={<span>Springs, not durations</span>}>
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  );
}
