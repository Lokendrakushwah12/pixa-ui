import { buttonSchema } from "@/lib/playground/button";
import { cardSchema } from "@/lib/playground/card";
import type { Schema } from "@/lib/playground/schema";

/** Keyed by the docs slug, so a page opts in simply by having an entry. */
export const playgrounds: Record<string, Schema> = {
  button: buttonSchema,
  "fluid-card": cardSchema,
};
