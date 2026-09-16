"use client";

import { Button } from "@/registry/default/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/default/ui/hover-card";

export default function Particle() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<span />}>
        <Button variant="ghost">Hover for a card</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="font-medium text-[13px]">Fluid Functionalism</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          MIT. 26 components, 5 systems, 3 blocks.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
