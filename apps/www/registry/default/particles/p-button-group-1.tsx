"use client";

import { Button } from "@/registry/default/ui/button";
import { ButtonGroup } from "@/registry/default/ui/button-group";

export default function Particle() {
  return (
    <ButtonGroup>
      <Button variant="outline">Copy</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Archive</Button>
    </ButtonGroup>
  );
}
