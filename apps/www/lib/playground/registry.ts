import { accordionSchema } from "@/lib/playground/accordion";
import { askUserQuestionsSchema } from "@/lib/playground/ask-user-questions";
import { badgeSchema } from "@/lib/playground/badge";
import { buttonSchema } from "@/lib/playground/button";
import { cardSchema } from "@/lib/playground/card";
import { comboboxSchema } from "@/lib/playground/combobox";
import { inputOtpSchema } from "@/lib/playground/input-otp";
import type { Schema } from "@/lib/playground/schema";

/** Keyed by the docs slug, so a page opts in simply by having an entry. */
export const playgrounds: Record<string, Schema> = {
  "ask-user-questions": askUserQuestionsSchema,
  button: buttonSchema,
  "fluid-accordion": accordionSchema,
  "fluid-badge": badgeSchema,
  "fluid-card": cardSchema,
  "fluid-combobox": comboboxSchema,
  "input-otp": inputOtpSchema,
};
