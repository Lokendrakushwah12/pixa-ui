"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { decodeConfig, encodeConfig } from "@/lib/playground/prompt";
import { playgrounds } from "@/lib/playground/registry";
import {
  type Config,
  initialConfig,
  randomConfig,
  type Schema,
} from "@/lib/playground/schema";

type Value = {
  schema: Schema | null;
  config: Config;
  set: (id: string, value: string | boolean) => void;
  shuffle: () => void;
};

const PlaygroundContext = createContext<Value | null>(null);

/**
 * The panel lives in the right rail and the preview in the article body, so
 * the configuration has to sit above both rather than inside either.
 */
export function PlaygroundProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const schema = playgrounds[slug] ?? null;
  const [config, setConfig] = useState<Config>(() =>
    schema ? initialConfig(schema) : {},
  );

  const set = useCallback((id: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [id]: value }));
  }, []);

  const shuffle = useCallback(() => {
    if (schema) {
      setConfig(randomConfig(schema));
    }
  }, [schema]);

  const applied = useRef(false);

  /**
   * Read the incoming link, then keep the address bar in step. These have to
   * be one effect: as two, the write ran on mount with the defaults and
   * overwrote the preset before the read could use it.
   */
  useEffect(() => {
    if (!schema || !Object.keys(config).length) {
      return;
    }
    if (!applied.current) {
      applied.current = true;
      const decoded = decodeConfig(
        schema,
        new URLSearchParams(window.location.search).get("preset"),
      );
      if (decoded) {
        // Let the re-render write the URL, so this pass writes nothing.
        setConfig((prev) => ({ ...prev, ...decoded }));
        return;
      }
    }
    const url = new URL(window.location.href);
    url.searchParams.set("preset", encodeConfig(schema, config));
    window.history.replaceState(null, "", url);
  }, [schema, config]);

  const value = useMemo(
    () => ({ config, schema, set, shuffle }),
    [schema, config, set, shuffle],
  );

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  return useContext(PlaygroundContext);
}
