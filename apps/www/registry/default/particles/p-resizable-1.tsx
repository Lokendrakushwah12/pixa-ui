"use client";

import {
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/registry/default/ui/resizable";

export default function Particle() {
  return (
    <div className="h-48 w-full overflow-hidden rounded-lg border border-border">
      <ResizableGroup orientation="horizontal">
        <ResizablePanel defaultSize="30" minSize="15">
          <div className="flex h-full items-center justify-center p-4 text-[12px] text-muted-foreground">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizableGroup orientation="vertical">
            <ResizablePanel>
              <div className="flex h-full items-center justify-center p-4 text-[12px] text-muted-foreground">
                Editor — drag any edge
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="30">
              <div className="flex h-full items-center justify-center p-4 text-[12px] text-muted-foreground">
                Console
              </div>
            </ResizablePanel>
          </ResizableGroup>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  );
}
