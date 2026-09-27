"use client";

import { Badge, badgeColors } from "@/registry/default/ui/fluid-badge";

export default function Particle() {
  const colors = Object.keys(badgeColors) as (keyof typeof badgeColors)[];
  return (
    <>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="dot">Dot</Badge>

      <Badge size="default">Default</Badge>
      <Badge size="compact">Compact</Badge>

      {colors.map((color) => (
        <Badge color={color} key={color}>
          {color}
        </Badge>
      ))}
    </>
  );
}
