"use client";

import { useState } from "react";
import type { AskUserQuestion } from "@/registry/default/ui/ask-user-questions";
import { AskUserQuestions } from "@/registry/default/ui/ask-user-questions";
import { Badge } from "@/registry/default/ui/badge";

const questions: AskUserQuestion[] = [
  {
    id: "role",
    options: [
      {
        description: "Prototyping flows and pages",
        id: "designer",
        title: "Designer",
      },
      {
        description: "Shipping production UI",
        id: "engineer",
        title: "Engineer",
      },
      { description: "Aligning the team on patterns", id: "pm", title: "PM" },
    ],
    skippable: true,
    title: "How do you plan to use this set?",
  },
  {
    allowOther: true,
    id: "features",
    multiSelect: true,
    options: [
      { id: "motion", title: "Spring motion" },
      { id: "hover", title: "Fluid hover" },
      { id: "a11y", title: "Accessibility" },
    ],
    title: "Which parts matter most?",
  },
];

export default function Particle() {
  const [done, setDone] = useState<string | null>(null);
  return (
    <>
      <div className="w-full max-w-md">
        <AskUserQuestions
          onComplete={(answers) =>
            setDone(`${Object.keys(answers).length} answered`)
          }
          questions={questions}
        />
      </div>
      {done && <Badge color="green">{done}</Badge>}
    </>
  );
}
