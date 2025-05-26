import path from "path";
import { RegistryType, Schema } from "./registry-schema";

type ComponentDefinition = Partial<
  Pick<
    Schema,
    | "dependencies"
    | "devDependencies"
    | "registryDependencies"
    | "cssVars"
    | "tailwind"
  >
> & {
  name: string;
  path: string;
  description: string;
  files?: {
    name: string;
    path: string;
    type?: RegistryType;
  }[];
};

export const components: ComponentDefinition[] = [
  {
    name: "animated-tabs",
    path: path.join(__dirname, "../components/core/animated-tabs.tsx"),
    registryDependencies: [],
    dependencies: ["motion"],
    description:
      "A tab component with smooth animations for switching between different content sections.",
  },
];
