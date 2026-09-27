"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/fluid-card";

export default function Particle() {
  return (
    <>
      <Card className="max-w-xs">
        <CardHeader>
          <CardTitle>Fluid hover</CardTitle>
          <CardDescription>
            The closest item highlights before you click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] text-muted-foreground">
            Motion is information, not decoration.
          </p>
        </CardContent>
      </Card>
      <CardGroup className="w-full max-w-lg" columns={2}>
        {["Springs", "Fluid hover", "Weight shifts", "Accessible"].map((t) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle>{t}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </CardGroup>
    </>
  );
}
