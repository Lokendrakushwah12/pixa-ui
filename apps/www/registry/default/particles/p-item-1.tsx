"use client";

import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar";
import { Badge } from "@/registry/default/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/default/ui/item";

export default function Particle() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border">
      <ItemGroup>
        {[
          { email: "ada@example.com", name: "Ada Byron", role: "Owner" },
          {
            email: "grace@example.com",
            name: "Grace Hopper",
            role: "Member",
          },
        ].map((p) => (
          <Item interactive key={p.name}>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>{p.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{p.name}</ItemTitle>
              <ItemDescription>{p.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge color={p.role === "Owner" ? "green" : undefined}>
                {p.role}
              </Badge>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
