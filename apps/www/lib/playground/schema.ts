import type { ReactNode } from "react";

export type Control =
  | {
      kind: "select";
      id: string;
      label: string;
      options: readonly string[];
      initial: string;
    }
  | { kind: "toggle"; id: string; label: string; initial: boolean };

export type Group = { label?: string; controls: Control[] };

export type Config = Record<string, string | boolean>;

export type Schema = {
  /** Registry name of the component the prompt installs. */
  name: string;
  /** Heading shown above the preview and used in the prompt. */
  title: string;
  groups: Group[];
  /** A control can be forced on/off by the state of others. */
  derive?: (
    config: Config,
  ) => Record<
    string,
    { value?: string | boolean; locked?: boolean } | undefined
  >;
  render: (config: Config) => ReactNode;
  /** Prompt body describing the built-in behaviours of this component. */
  craft: string[];
  propDocs: string[];
  summary: string;
};

export function controlsOf(schema: Schema): Control[] {
  return schema.groups.flatMap((g) => g.controls);
}

export function initialConfig(schema: Schema): Config {
  const out: Config = {};
  for (const c of controlsOf(schema)) {
    out[c.id] = c.initial;
  }
  return out;
}

/** Applies `derive` so locked controls report the value the component will use. */
export function resolveConfig(schema: Schema, config: Config): Config {
  const derived = schema.derive?.(config) ?? {};
  const out: Config = { ...config };
  for (const [id, rule] of Object.entries(derived)) {
    if (rule?.value !== undefined) {
      out[id] = rule.value;
    }
  }
  return out;
}

export function lockedIds(schema: Schema, config: Config): Set<string> {
  const derived = schema.derive?.(config) ?? {};
  return new Set(
    Object.entries(derived)
      .filter(([, rule]) => rule?.locked)
      .map(([id]) => id),
  );
}

/** A short, stable id for the current configuration, used in the prompt link. */
export function presetId(schema: Schema, config: Config): string {
  const serialised = controlsOf(schema)
    .map((c) => `${c.id}=${String(config[c.id])}`)
    .join("&");
  let hash = 5381;
  for (let i = 0; i < serialised.length; i += 1) {
    hash = (Math.imul(hash, 33) ^ serialised.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 5);
}

export function randomConfig(schema: Schema): Config {
  const out: Config = {};
  for (const c of controlsOf(schema)) {
    out[c.id] =
      c.kind === "toggle"
        ? Math.random() < 0.5
        : (c.options[Math.floor(Math.random() * c.options.length)] as string);
  }
  return out;
}
