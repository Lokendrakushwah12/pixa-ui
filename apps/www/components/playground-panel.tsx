"use client";

import {
  ArrowDown01Icon,
  Copy01Icon,
  ShuffleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { usePlayground } from "@/components/playground-context";
import { buildPrompt } from "@/lib/playground/prompt";
import {
  type Control,
  lockedIds,
  resolveConfig,
} from "@/lib/playground/schema";
import { cn } from "@/lib/utils";
import { Switch } from "@/registry/default/ui/switch";

/** A control reads as active when it is doing something, and recedes when not. */
function labelTone(active: boolean) {
  return active ? "text-foreground" : "text-muted-foreground";
}

function Row({
  control,
  value,
  locked,
  onChange,
}: {
  control: Control;
  value: string | boolean;
  locked: boolean;
  onChange: (next: string | boolean) => void;
}) {
  if (control.kind === "toggle") {
    const on = Boolean(value);
    return (
      <label
        className={cn(
          "flex h-9 items-center justify-between gap-3",
          locked && "pointer-events-none opacity-64",
        )}
      >
        <span className={cn("text-sm", labelTone(on))}>{control.label}</span>
        <Switch
          checked={on}
          disabled={locked}
          onCheckedChange={(next) => onChange(next)}
        />
      </label>
    );
  }

  const isDefault = value === control.initial;
  return (
    <label
      className={cn(
        "flex h-9 items-center justify-between gap-3",
        locked && "pointer-events-none opacity-64",
      )}
    >
      <span className={cn("text-sm", labelTone(!isDefault))}>
        {control.label}
      </span>
      <span className="relative flex items-center gap-1">
        <select
          className="cursor-pointer appearance-none bg-transparent py-1 pr-5 text-right text-foreground text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          disabled={locked}
          onChange={(e) => onChange(e.target.value)}
          value={String(value)}
        >
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <HugeiconsIcon
          className="pointer-events-none absolute right-0 size-4 text-muted-foreground"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      </span>
    </label>
  );
}

export function PlaygroundPanel() {
  const ctx = usePlayground();
  const [copied, setCopied] = useState(false);

  if (!ctx?.schema) {
    return null;
  }
  const { schema, config, set, shuffle } = ctx;
  const locked = lockedIds(schema, config);
  const resolved = resolveConfig(schema, config);

  const copy = async () => {
    await navigator.clipboard.writeText(buildPrompt(schema, resolved));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-2xl bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-1">
        <span className="font-semibold text-base text-foreground">
          Playground variant
        </span>
        <button
          aria-label="Shuffle the configuration"
          className="-mr-1 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-100 hover:text-foreground active:scale-[0.97]"
          onClick={shuffle}
          type="button"
        >
          <HugeiconsIcon icon={ShuffleIcon} size={18} strokeWidth={2} />
        </button>
      </div>

      {schema.groups.map((group, i) => (
        <div
          className={cn(
            "px-4 pb-2",
            i > 0 && "mt-1 border-border/60 border-t pt-3",
          )}
          key={group.label ?? `group-${i}`}
        >
          {group.label ? (
            <div className="pt-2 pb-1 font-semibold text-foreground text-sm">
              {group.label}
            </div>
          ) : null}
          {group.controls.map((control) => (
            <Row
              control={control}
              key={control.id}
              locked={locked.has(control.id)}
              onChange={(next) => set(control.id, next)}
              value={resolved[control.id] ?? control.initial}
            />
          ))}
        </div>
      ))}

      <div className="border-border/60 border-t p-3">
        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-foreground font-medium text-background text-sm transition-[opacity,scale] duration-100 hover:opacity-90 active:scale-[0.99]"
          onClick={copy}
          type="button"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={16}
            strokeWidth={2}
          />
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
    </div>
  );
}
