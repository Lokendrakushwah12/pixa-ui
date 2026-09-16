"use client";

import type { Citation } from "@/registry/default/ui/inline-citations";
import {
  CitationList,
  CitedText,
} from "@/registry/default/ui/inline-citations";

const citations: Citation[] = [
  {
    id: "mit",
    snippet:
      "Permission is hereby granted, free of charge, to any person obtaining a copy…",
    source: "github.com",
    title: "fluid-functionalism — LICENSE",
    url: "https://github.com/mickadesign/fluid-functionalism",
  },
  {
    id: "reg",
    snippet:
      "A registry item describes its files, dependencies and registry dependencies.",
    source: "ui.shadcn.com",
    title: "shadcn registry protocol",
  },
];

export default function Particle() {
  const answer =
    "Fluid Functionalism is MIT licensed, so the components can be installed and modified freely.[^mit] " +
    "It publishes them through the standard shadcn registry protocol, which resolves dependencies on its own.[^reg]";
  return (
    <>
      <div className="w-full max-w-lg">
        <CitedText citations={citations} text={answer} />
      </div>
      <div className="w-full max-w-lg">
        <CitationList citations={citations} />
      </div>
    </>
  );
}
