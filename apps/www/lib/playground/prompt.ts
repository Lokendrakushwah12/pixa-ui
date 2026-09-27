import { type Config, controlsOf, type Schema } from "./schema";

const SITE = "https://pixaui.com";

/** The chosen options, in the panel's own words, for the top of the prompt. */
function chosenLines(schema: Schema, config: Config): string[] {
  return schema.groups.flatMap((group) =>
    group.controls.map((c) => {
      const value = config[c.id];
      const shown =
        c.kind === "toggle" ? (value ? "on" : "off") : String(value);
      return `- ${group.label ? `${group.label} → ` : ""}${c.label}: ${shown}`;
    }),
  );
}

export function buildPrompt(schema: Schema, config: Config): string {
  // The reopen link has to carry the whole configuration: there is no preset
  // service behind this, the panel reads it straight back off the URL.
  const preset = encodeConfig(schema, config);
  const Export = `${schema.title.replace(/\s+/g, "")}Section`;
  const block = `${schema.title.toLowerCase().replace(/\s+/g, "-")}-section`;

  return [
    `Add the ${schema.title} I configured on pixa ui to my React app.`,
    "",
    "Install (shadcn CLI, one block with the component, its shared libs, and npm dependencies):",
    `npx shadcn@latest add ${SITE}/r/${schema.name}.json --overwrite`,
    "--overwrite replaces same-named stock shadcn files (button.tsx, dialog.tsx, ...) with this library's versions. Without it the CLI prompts per existing file and exits in a non-interactive shell before any component is written.",
    "",
    "Usage:",
    `- components/${block}.tsx exports ${Export}. Import it and render it where the ${schema.title.toLowerCase()} belongs.`,
    "The block already composes the component with the options I picked. Change props in that file, not in components/ui.",
    "",
    "Options I picked:",
    ...chosenLines(schema, config),
    "",
    `Props of the underlying ${schema.title}:`,
    ...schema.propDocs.map((p) => `- ${p}`),
    "",
    "Craft (built-in behaviors — compose around them, don't re-implement or fight them):",
    ...schema.craft.map((c) => `- ${c}`),
    "",
    schema.summary,
    `Reopen or tweak this configuration: ${SITE}/docs/components/${schema.name}?preset=${preset}`,
    `Docs: ${SITE}/docs/components/${schema.name}`,
  ].join("\n");
}

/** Round-trips the panel state through the URL so a shared link reopens it. */
export function encodeConfig(schema: Schema, config: Config): string {
  return controlsOf(schema)
    .map((c) => {
      const v = config[c.id];
      return `${c.id}:${c.kind === "toggle" ? (v ? "1" : "0") : encodeURIComponent(String(v))}`;
    })
    .join(",");
}

export function decodeConfig(
  schema: Schema,
  raw: string | null,
): Config | null {
  if (!raw) {
    return null;
  }
  const byId = new Map(controlsOf(schema).map((c) => [c.id, c]));
  const out: Config = {};
  for (const pair of raw.split(",")) {
    const [id, value] = pair.split(":");
    const control = id ? byId.get(id) : undefined;
    if (!control || value === undefined) {
      continue;
    }
    if (control.kind === "toggle") {
      out[id as string] = value === "1";
    } else {
      const decoded = decodeURIComponent(value);
      if (control.options.includes(decoded)) {
        out[id as string] = decoded;
      }
    }
  }
  return Object.keys(out).length ? out : null;
}
