"use client";

import { Fragment, type ReactNode } from "react";

import { cn } from "../../lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/fluid/hover-card";

interface Citation {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  source?: string;
}

function CitationMarker({
  citation,
  index,
  className,
}: {
  citation: Citation;
  index: number;
  className?: string;
}) {
  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={`Source ${index}: ${citation.title}`}
          className={cn(
            "mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] px-1",
            "align-super text-[10px] font-medium tabular-nums",
            "bg-muted text-muted-foreground",
            "transition-colors duration-100 hover:bg-accent hover:text-foreground",
            "outline-none focus-visible:ring-1 focus-visible:ring-ring",
            className
          )}
        >
          {index}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <p className="text-[13px] font-medium text-foreground">{citation.title}</p>
        {citation.source && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{citation.source}</p>
        )}
        {citation.snippet && (
          <p className="mt-2 border-l-2 border-border pl-2 text-[12px] text-muted-foreground">
            {citation.snippet}
          </p>
        )}
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block truncate text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {citation.url}
          </a>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

function CitedText({
  text,
  citations,
  className,
}: {
  text: string;
  citations: Citation[];
  className?: string;
}) {
  const byId = new Map(citations.map((c) => [c.id, c]));
  const order: string[] = [];
  const parts = text.split(/(\[\^[^\]]+\])/g);

  return (
    <span data-slot="cited-text" className={cn("text-[13px]", className)}>
      {parts.map((part, i) => {
        const match = /^\[\^([^\]]+)\]$/.exec(part);
        if (!match) return <Fragment key={i}>{part}</Fragment>;

        const citation = byId.get(match[1]);
        if (!citation) return <Fragment key={i}>{part}</Fragment>;

        if (!order.includes(citation.id)) order.push(citation.id);
        return (
          <CitationMarker
            key={i}
            citation={citation}
            index={order.indexOf(citation.id) + 1}
          />
        );
      })}
    </span>
  );
}

function CitationList({
  citations,
  className,
  children,
}: {
  citations: Citation[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <ol className={cn("flex flex-col gap-1.5", className)}>
      {citations.map((c, i) => (
        <li key={c.id} className="flex gap-2 text-[12px]">
          <span className="text-muted-foreground tabular-nums">{i + 1}.</span>
          <div className="min-w-0">
            {c.url ? (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                {c.title}
              </a>
            ) : (
              <span className="text-foreground">{c.title}</span>
            )}
            {c.source && <span className="ml-1.5 text-muted-foreground">{c.source}</span>}
          </div>
        </li>
      ))}
      {children}
    </ol>
  );
}

export { CitedText, CitationMarker, CitationList };
export type { Citation };
