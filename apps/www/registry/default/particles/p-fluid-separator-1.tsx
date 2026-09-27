"use client";

import { Separator } from "@/registry/default/ui/fluid-separator";

export default function Particle() {
  return (
    <>
      <div className="w-64">
        <p className="pb-2 text-[13px]">Above</p>
        <Separator />
        <p className="pt-2 text-[13px]">Below</p>
      </div>
      <div className="flex h-5 items-center gap-3">
        <span className="text-[13px]">Left</span>
        <Separator orientation="vertical" />
        <span className="text-[13px]">Right</span>
      </div>
    </>
  );
}
