"use client";

import { usePlayground } from "@/components/playground-context";
import { resolveConfig } from "@/lib/playground/schema";

/**
 * The live half of the playground. The panel in the right rail edits the same
 * configuration, so this only has to render whatever it currently holds.
 */
export function Playground() {
  const ctx = usePlayground();

  if (!ctx?.schema) {
    return null;
  }

  return (
    <div
      className="group relative mt-4 mb-12 flex flex-col gap-2"
      data-slot="playground"
    >
      <div className="relative rounded-xl border">
        <div className="flex min-h-[320px] w-full items-center justify-center overflow-y-auto p-10 max-sm:px-6">
          <div data-slot="playground-preview">
            {ctx.schema.render(resolveConfig(ctx.schema, ctx.config))}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-xs xl:hidden">
        Open this page on a wider screen to configure the variant.
      </p>
    </div>
  );
}
