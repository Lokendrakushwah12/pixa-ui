"use client";

import { useState } from "react";
import { Textarea } from "@/registry/default/ui/fluid-textarea";

export default function Particle() {
  const [note, setNote] = useState("");
  return (
    <>
      <div className="w-full max-w-sm">
        <Textarea
          autoResize
          maxRows={6}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type several lines…"
          value={note}
        />
      </div>
      <div className="w-full max-w-sm">
        <Textarea placeholder="Three rows, resizable by the handle" rows={3} />
      </div>
      <div className="w-full max-w-sm">
        <Textarea aria-invalid defaultValue="Rejected value" rows={2} />
      </div>
    </>
  );
}
