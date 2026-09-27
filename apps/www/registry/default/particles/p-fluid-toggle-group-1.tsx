"use client";

import { useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/default/ui/fluid-toggle-group";

export default function Particle() {
  const [align, setAlign] = useState("left");
  const [marks, setMarks] = useState<string[]>(["bold"]);
  return (
    <>
      <ToggleGroup
        onValueChange={((v: string) => v && setAlign(v)) as never}
        type="single"
        value={align}
      >
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup onValueChange={setMarks} type="multiple" value={marks}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
