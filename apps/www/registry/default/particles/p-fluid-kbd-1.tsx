"use client";

import { Kbd } from "@/registry/default/ui/fluid-kbd";

export default function Particle() {
  return (
    <>
      <span className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>

      <Kbd size="default">⏎</Kbd>
      <Kbd size="compact">⏎</Kbd>

      <span className="text-[13px]">
        Press <Kbd>Esc</Kbd> to dismiss.
      </span>
    </>
  );
}
