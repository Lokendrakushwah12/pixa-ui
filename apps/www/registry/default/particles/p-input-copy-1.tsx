"use client";

import { InputCopy } from "@/registry/default/ui/input-copy";

export default function Particle() {
  return (
    <>
      <div className="w-full max-w-sm">
        <InputCopy
          label="Install"
          value="npx shadcn@latest add @fluid/button"
        />
      </div>
      <div className="w-full max-w-sm">
        <InputCopy size="compact" value="sk_live_1234567890" />
      </div>
      <div className="w-full max-w-sm">
        <InputCopy disabled value="unavailable" />
      </div>
    </>
  );
}
