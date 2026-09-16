"use client";

import { useState } from "react";
import { InputMessage } from "@/registry/default/ui/input-message";

export default function Particle() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  return (
    <>
      <div className="w-full max-w-md">
        <InputMessage
          onSend={(text) => {
            if (text.trim()) setSent((prev) => [...prev, text.trim()]);
            setValue("");
          }}
          onValueChange={setValue}
          placeholder="Ask anything…"
          value={value}
        />
      </div>
      {sent.length > 0 && (
        <div className="flex flex-col gap-1">
          {sent.map((s) => (
            <span className="text-[12px] text-muted-foreground" key={s}>
              {s}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
