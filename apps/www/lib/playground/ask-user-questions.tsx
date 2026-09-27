import type { Config, Schema } from "@/lib/playground/schema";
import {
  type AskUserQuestion,
  AskUserQuestions,
} from "@/registry/default/ui/ask-user-questions";

const OPTIONS = [
  {
    description: "Ship the first thing that works.",
    id: "speed",
    title: "Speed",
  },
  {
    description: "Get the details right up front.",
    id: "craft",
    title: "Craft",
  },
  {
    description: "Build for the load that is coming.",
    id: "scale",
    title: "Scale",
  },
];

const TITLES = [
  "What matters most on this project?",
  "Where should the work land?",
  "Who reviews it before release?",
];

export const askUserQuestionsSchema: Schema = {
  craft: [
    "Number keys 1-9 pick an option directly, so a keyboard user never has to arrow through a list to answer.",
    "The card measures the outgoing and incoming question and animates between the two heights, rather than snapping as the content swaps.",
    "The 'other' row turns into its own input in place and takes focus, so choosing it and answering it is one action.",
    "A skipped question keeps its slot in the flow so the progress chip count never changes under the reader.",
  ],
  /**
   * Multiline belongs to the free-text box; multi-select and "other" belong to
   * the option list. Each set is locked off while the other type is showing.
   */
  derive: (config: Config) =>
    config.type === "Free text"
      ? {
          allowOther: { locked: true, value: false },
          chipPosition: { locked: true },
          multiSelect: { locked: true, value: false },
        }
      : { multiline: { locked: true } },
  groups: [
    {
      controls: [
        {
          id: "type",
          initial: "Options",
          kind: "select",
          label: "Type",
          options: ["Options", "Free text"],
        },
        {
          id: "layout",
          initial: "Inline",
          kind: "select",
          label: "Layout",
          options: ["Inline", "Stacked"],
        },
        {
          id: "chipPosition",
          initial: "Right",
          kind: "select",
          label: "Chip position",
          options: ["Left", "Right"],
        },
        {
          id: "multiSelect",
          initial: false,
          kind: "toggle",
          label: "Multi-select",
        },
        {
          id: "allowOther",
          initial: false,
          kind: "toggle",
          label: "Allow other",
        },
        { id: "multiline", initial: true, kind: "toggle", label: "Multiline" },
      ],
      label: "Question",
    },
    {
      controls: [
        {
          id: "questions",
          initial: "3",
          kind: "select",
          label: "Questions",
          options: ["1", "2", "3"],
        },
        { id: "skippable", initial: true, kind: "toggle", label: "Skippable" },
      ],
      label: "Flow",
    },
  ],
  name: "ask-user-questions",
  propDocs: [
    "questions: the flow. Each entry carries its own layout, options and validation.",
    "question.options: the choices. Omit them and set freeText for a typed answer.",
    'question.layout: "inline" | "stacked" (default "inline"). Chip beside the title, or above it.',
    'question.chipPosition: "left" | "right" (default "right"). Which side the number chip sits on.',
    "question.multiSelect / allowOther: several answers, and an editable other row.",
    "question.freeTextMultiline: a growing textarea rather than a single line.",
    "currentIndex / answers: drive the flow from outside, or let it hold its own state.",
  ],
  render: (config) => {
    const freeText = config.type === "Free text";
    const count = Number(config.questions);
    const questions: AskUserQuestion[] = TITLES.slice(0, count).map(
      (title, i) => ({
        chipPosition: config.chipPosition === "Left" ? "left" : "right",
        id: `q${i}`,
        layout: config.layout === "Stacked" ? "stacked" : "inline",
        skippable: Boolean(config.skippable),
        title,
        ...(freeText
          ? {
              freeText: true,
              freeTextMultiline: Boolean(config.multiline),
              freeTextPlaceholder: "Type your answer…",
            }
          : {
              allowOther: Boolean(config.allowOther),
              multiSelect: Boolean(config.multiSelect),
              options: OPTIONS,
            }),
      }),
    );
    return (
      <div className="w-full max-w-md">
        <AskUserQuestions
          key={`${freeText}-${count}-${String(config.layout)}`}
          questions={questions}
        />
      </div>
    );
  },
  summary:
    "A stepped question flow with keyboard shortcuts, measured transitions between questions, and an inline other row.",
  title: "Ask User Questions",
};
