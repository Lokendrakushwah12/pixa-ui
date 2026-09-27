"use client";

import { ScrollArea } from "@/registry/default/ui/fluid-scroll-area";

export default function Particle() {
  return (
    <>
      <ScrollArea className="h-40 w-64 rounded-lg border border-border p-3">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 20 }, (_, i) => `Row ${i + 1}`).map((row) => (
            <p className="text-[13px]" key={row}>
              {row}
            </p>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea
        className="w-72 rounded-lg border border-border p-3"
        orientation="horizontal"
      >
        <div className="flex gap-3">
          {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted text-[12px]"
              key={n}
            >
              {n}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
