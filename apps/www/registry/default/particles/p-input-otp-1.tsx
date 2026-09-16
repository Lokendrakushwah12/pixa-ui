"use client";

import { useState } from "react";
import { InputOTP } from "@/registry/default/ui/input-otp";

export default function Particle() {
  const [code, setCode] = useState("");
  const [grouped, setGrouped] = useState("");
  const [alpha, setAlpha] = useState("");
  const invalid = code.length === 6 && code !== "123456";

  return (
    <>
      <InputOTP
        invalid={invalid}
        maxLength={6}
        onChange={setCode}
        value={code}
      />
      <span className="text-[12px] text-muted-foreground">
        {invalid ? "Rejected" : "Waiting for six digits"}
      </span>
      <InputOTP
        groups={[3, 3]}
        maxLength={6}
        onChange={setGrouped}
        value={grouped}
      />
      <InputOTP
        maxLength={4}
        mode="alphanumeric"
        onChange={setAlpha}
        value={alpha}
      />
      <InputOTP maxLength={6} onChange={setCode} size="compact" value={code} />
    </>
  );
}
