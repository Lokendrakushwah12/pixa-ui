"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Progress } from "@/registry/default/ui/fluid-progress";

export default function Particle() {
  const [value, setValue] = useState(40);
  return (
    <>
      <div className="flex w-64 flex-col gap-3">
        <Progress value={value} />
        <div className="flex gap-2">
          <Button
            onClick={() => setValue((v) => Math.max(0, v - 20))}
            size="compact"
            variant="outline"
          >
            −20
          </Button>
          <Button
            onClick={() => setValue((v) => Math.min(100, v + 20))}
            size="compact"
            variant="outline"
          >
            +20
          </Button>
        </div>
      </div>
      <div className="w-48">
        <Progress value={null} />
      </div>
    </>
  );
}
