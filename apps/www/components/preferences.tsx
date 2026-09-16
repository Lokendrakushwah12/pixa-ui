"use client";

import { Settings03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSoundMaybe } from "@pixa/ui/components/fluid/sound";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Group } from "@/registry/default/ui/group";
import { Label } from "@/registry/default/ui/label";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { Switch } from "@/registry/default/ui/switch";

const STORAGE_KEY = "pixa:prefs";

const RADII = [
  { label: "Sharp", value: "0rem" },
  { label: "Small", value: "0.25rem" },
  { label: "Default", value: "0.375rem" },
  { label: "Large", value: "0.625rem" },
  { label: "Round", value: "1rem" },
] as const;

const FONTS = [
  { label: "Sans", value: "" },
  { label: "Mono", value: "var(--font-mono)" },
  { label: "Display", value: "var(--font-heading)" },
] as const;

const ACCENTS = [
  { label: "Default", swatch: "var(--primary)", value: "" },
  { label: "Blue", swatch: "var(--color-blue-600)", value: "blue" },
  { label: "Violet", swatch: "var(--color-violet-600)", value: "violet" },
  { label: "Emerald", swatch: "var(--color-emerald-600)", value: "emerald" },
  { label: "Amber", swatch: "var(--color-amber-500)", value: "amber" },
  { label: "Rose", swatch: "var(--color-rose-600)", value: "rose" },
] as const;

type Prefs = {
  radius: string;
  font: string;
  accent: string;
};

const DEFAULTS: Prefs = { accent: "", font: "", radius: "0.375rem" };

/**
 * Both overrides need more specificity than the declarations they replace,
 * which is why this is a stylesheet and not inline style on <html>:
 *
 * - next/font declares --font-sans on <body> through a generated class, so an
 *   <html> override is shadowed for the whole document. `html body[class]`
 *   outranks that class.
 * - --primary is declared again under `.dark`, which beats a plain `:root`
 *   override in dark mode. `:root.dark` outranks it.
 *
 * Kept in step with the pre-paint script in app/layout.tsx, which builds the
 * same rules so a saved preference never flashes the default first.
 */
function cssFor(prefs: Prefs) {
  const rules: string[] = [];

  if (prefs.font) {
    rules.push(`html body[class]{--font-sans:${prefs.font}}`);
  }

  const tokens: string[] = [];
  if (prefs.radius && prefs.radius !== DEFAULTS.radius) {
    tokens.push(`--radius:${prefs.radius}`);
  }
  if (prefs.accent) {
    tokens.push(`--primary:var(--color-${prefs.accent}-600)`);
    tokens.push("--primary-foreground:var(--color-white)");
  }
  if (tokens.length > 0) {
    rules.push(`:root,:root.dark{${tokens.join(";")}}`);
  }

  return rules.join("");
}

function apply(prefs: Prefs) {
  let tag = document.getElementById("pixa-prefs");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "pixa-prefs";
    document.head.append(tag);
  }
  tag.textContent = cssFor(prefs);
}

function read(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function Preferences() {
  const [prefs, setPrefs] = React.useState<Prefs>(DEFAULTS);
  const sound = useSoundMaybe();

  React.useEffect(() => {
    setPrefs(read());
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // A blocked localStorage costs the user persistence, not the setting.
      }
      return next;
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button aria-label="Preferences" size="icon-sm" variant="ghost" />
        }
      >
        <HugeiconsIcon icon={Settings03Icon} strokeWidth={2} />
      </PopoverTrigger>
      <PopoverPopup align="end" className="w-72 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Roundedness</Label>
            <Group>
              {RADII.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => update({ radius: option.value })}
                  size="xs"
                  variant={
                    prefs.radius === option.value ? "default" : "outline"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </Group>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Accent</Label>
            <div className="flex items-center gap-1.5">
              {ACCENTS.map((option) => (
                <button
                  aria-label={option.label}
                  aria-pressed={prefs.accent === option.value}
                  className={cn(
                    "size-6 cursor-pointer rounded-md border border-border transition-[outline]",
                    prefs.accent === option.value &&
                      "outline-2 outline-ring outline-offset-2",
                  )}
                  key={option.label}
                  onClick={() => update({ accent: option.value })}
                  style={{ background: option.swatch }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Font</Label>
            <Group>
              {FONTS.map((option) => (
                <Button
                  key={option.label}
                  onClick={() => update({ font: option.value })}
                  size="xs"
                  variant={prefs.font === option.value ? "default" : "outline"}
                >
                  {option.label}
                </Button>
              ))}
            </Group>
          </div>

          {sound ? (
            <div className="flex items-center justify-between gap-2">
              <Label className="text-muted-foreground text-xs" htmlFor="sound">
                Sound
              </Label>
              <Switch
                checked={sound.enabled}
                id="sound"
                onCheckedChange={(on: boolean) => sound.setEnabled(on)}
              />
            </div>
          ) : null}
        </div>
      </PopoverPopup>
    </Popover>
  );
}
