"use client";

import { ImageGeneration } from "@/registry/default/ui/image-generation";

export default function Particle() {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <ImageGeneration className="w-40" prompt="Queued" state="queued" />
        <ImageGeneration
          className="w-40"
          progress={62}
          prompt="Generating"
          state="generating"
        />
        <ImageGeneration
          className="w-40"
          error="Content policy"
          prompt="Failed"
          state="failed"
        />
      </div>
      <ImageGeneration
        className="w-56"
        prompt="16 : 9"
        ratio={16 / 9}
        state="generating"
      />
    </>
  );
}
