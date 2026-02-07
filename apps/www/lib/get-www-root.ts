import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolves the www app root directory.
 * Use this in route handlers so paths work when the app is run from
 * the monorepo root (e.g. `pnpm dev`) or from apps/www.
 */
export function getWwwRoot(): string {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "registry"))) {
    return cwd;
  }
  return path.join(cwd, "apps", "www");
}
