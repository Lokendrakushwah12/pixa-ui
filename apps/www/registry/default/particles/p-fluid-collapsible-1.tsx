"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/default/ui/fluid-collapsible";

export default function Particle() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible className="w-full max-w-sm" onOpenChange={setOpen} open={open}>
      <CollapsibleTrigger asChild>
        <Button size="compact" variant="secondary">
          {open ? "Hide" : "Show"} details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="pt-3 text-[13px] text-muted-foreground">
          No second measurement in JS — the primitive already publishes the
          target height.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
