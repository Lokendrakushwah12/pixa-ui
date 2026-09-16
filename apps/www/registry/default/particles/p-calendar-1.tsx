"use client";

import { useState } from "react";
import { Calendar } from "@/registry/default/ui/calendar";

export default function Particle() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 15));
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>({
    from: new Date(2026, 8, 8),
    to: new Date(2026, 8, 17),
  });

  return (
    <>
      <div className="rounded-lg border border-border">
        <Calendar mode="single" onSelect={setDate} selected={date} />
      </div>
      <div className="rounded-lg border border-border">
        <Calendar
          mode="range"
          onSelect={setRange as never}
          selected={range as never}
        />
      </div>
    </>
  );
}
