"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { MobileDrawer } from "@/registry/default/ui/mobile-drawer";

export default function Particle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="secondary">
        Open drawer
      </Button>
      <MobileDrawer onClose={() => setOpen(false)} open={open}>
        <div className="flex flex-col gap-3 p-4">
          <p className="font-medium text-[14px]">Navigation</p>
          {["Home", "Inbox", "Calendar", "Settings"].map((l) => (
            <button
              className="rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-accent"
              key={l}
              onClick={() => setOpen(false)}
              type="button"
            >
              {l}
            </button>
          ))}
        </div>
      </MobileDrawer>
    </>
  );
}
