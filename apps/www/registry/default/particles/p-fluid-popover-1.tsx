"use client";

import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/fluid-popover";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/registry/default/ui/item";

export default function Particle() {
  return (
    <>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button size="compact" variant="secondary">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52" side={side}>
            <p className="text-[12px] text-muted-foreground">
              Anchored {side}.
            </p>
          </PopoverContent>
        </Popover>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Flush surface</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" padded={false}>
          <ItemGroup>
            <Item interactive>
              <ItemContent>
                <ItemTitle>First</ItemTitle>
              </ItemContent>
            </Item>
            <Item interactive>
              <ItemContent>
                <ItemTitle>Second</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </PopoverContent>
      </Popover>
    </>
  );
}
