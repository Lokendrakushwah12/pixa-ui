"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { StreamingText } from "@/registry/default/ui/streaming-text";

export default function Particle() {
  const [run, setRun] = useState(0);
  return (
    <>
      <div className="flex w-full max-w-lg flex-col gap-3">
        <StreamingText
          className="text-[13px]"
          key={run}
          text="Motion is information, not decoration. Every transition here exists to make a state change legible — and this sentence arrives one character at a time to prove it."
        />
        <Button
          onClick={() => setRun((n) => n + 1)}
          size="compact"
          variant="secondary"
        >
          Replay
        </Button>
      </div>
      <div className="flex w-full max-w-lg flex-col gap-2">
        <StreamingText
          className="text-[13px]"
          key={`slow-${run}`}
          speed={60}
          text="Slower, at 60 characters a second."
        />
        <StreamingText
          className="text-[13px]"
          key={`fast-${run}`}
          speed={600}
          text="Faster, at 600."
        />
      </div>
    </>
  );
}
