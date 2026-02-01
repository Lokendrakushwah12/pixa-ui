import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type Config = {
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  installationType: "cli" | "manual";
};

type ConfigState = {
  config: Config;
  setConfig: (config: Config) => void;
};

const defaultConfig: Config = {
  installationType: "cli",
  packageManager: "pnpm",
};

interface ConfigStore {
  config: Config;
  setConfig: (config: Config) => void;
}

const configStore: StateCreator<ConfigState> = (
  set: (state: Partial<ConfigState>) => void,
): ConfigStore => ({
  config: defaultConfig,
  setConfig: (config: Config): void => set({ config }),
});

export const useConfig = create<ConfigState>()(
  persist<ConfigState>(configStore, {
    name: "config",
  }),
);
