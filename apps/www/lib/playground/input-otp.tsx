"use client";

import { useState } from "react";

import type { Config, Schema } from "@/lib/playground/schema";
import { InputOTP } from "@/registry/default/ui/input-otp";

function OtpPreview({ config }: { config: Config }) {
  const length = Number(config.length);
  const [code, setCode] = useState("");
  const groups =
    config.grouping === "None"
      ? [length]
      : length % 2 === 0
        ? [length / 2, length / 2]
        : [Math.ceil(length / 2), Math.floor(length / 2)];

  return (
    <InputOTP
      groups={groups}
      invalid={Boolean(config.invalid)}
      key={`${length}-${String(config.grouping)}`}
      maxLength={length}
      mode={config.mode === "Alphanumeric" ? "alphanumeric" : "digits"}
      onChange={setCode}
      value={code}
    />
  );
}

export const inputOtpSchema: Schema = {
  craft: [
    "One focus ring glides between slots rather than each slot drawing its own, so the caret reads as a single object moving along the field.",
    "A paste fills every slot at once and lands the caret past the last filled one, instead of dropping everything into the slot that happened to have focus.",
    "Backspace in an empty slot steps back and clears the previous one, which is what the key is for when the current slot has nothing to delete.",
  ],
  groups: [
    {
      controls: [
        {
          id: "length",
          initial: "6",
          kind: "select",
          label: "Length",
          options: ["4", "6", "8"],
        },
        {
          id: "grouping",
          initial: "Split",
          kind: "select",
          label: "Grouping",
          options: ["Split", "None"],
        },
        {
          id: "mode",
          initial: "Digits",
          kind: "select",
          label: "Mode",
          options: ["Digits", "Alphanumeric"],
        },
        { id: "invalid", initial: false, kind: "toggle", label: "Invalid" },
      ],
    },
  ],
  name: "input-otp",
  propDocs: [
    "maxLength: number (default 6). How many characters the code holds.",
    "groups: number[]. Slot counts per group, e.g. [3, 3] for a separated six-digit code.",
    'mode: "digits" | "alphanumeric" (default "digits"). Which characters the field accepts.',
    "invalid: boolean (default false). Marks the whole field as rejected.",
    "value / onChange: the code as a string, controlled as any other input.",
  ],
  render: (config) => <OtpPreview config={config} />,
  summary:
    "A segmented one-time code field with one ring that glides between slots, and paste that fills the whole code.",
  title: "Input OTP",
};
