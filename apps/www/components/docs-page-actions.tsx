"use client";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCopyToClipboard } from "@pixa/ui/hooks/use-copy-to-clipboard";
import Link from "next/link";

import {
  ClaudeMark,
  MarkdownMark,
  OpenAIMark,
  SciraMark,
  V0Mark,
} from "@/components/brand-marks";
import { Button } from "@/registry/default/ui/button";
import { Group, GroupSeparator } from "@/registry/default/ui/group";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/registry/default/ui/menu";

type Neighbour = { url: string; title: string } | null;

const assistants = [
  { label: "Open in v0", Mark: V0Mark, url: "https://v0.dev?q=" },
  { label: "Open in ChatGPT", Mark: OpenAIMark, url: "https://chatgpt.com?q=" },
  {
    label: "Open in Claude",
    Mark: ClaudeMark,
    url: "https://claude.ai/new?q=",
  },
  { label: "Open in Scira", Mark: SciraMark, url: "https://scira.ai/?q=" },
];

export function DocsPageActions({
  page,
  rawUrl,
  title,
  previous,
  next,
}: {
  page: string;
  rawUrl: string;
  title: string;
  previous?: Neighbour;
  next?: Neighbour;
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  // Built on click so it carries whatever origin the page is actually served
  // from — no base-URL env var to keep in step with the deployment.
  const prompt = () => {
    const href = `${window.location.origin}${rawUrl}`;
    return encodeURIComponent(
      `I'm looking at the pixa ui documentation for ${title}: ${href}\nHelp me understand how to use it.`,
    );
  };

  const open = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <Group>
        <Button
          onClick={() => copyToClipboard(page)}
          size="xs"
          variant="outline"
        >
          <HugeiconsIcon
            icon={isCopied ? Tick02Icon : Copy01Icon}
            strokeWidth={2.5}
          />
          {isCopied ? "Copied" : "Copy Page"}
        </Button>
        <GroupSeparator />
        <Menu>
          <MenuTrigger
            render={
              <Button
                aria-label="More page actions"
                size="icon-xs"
                variant="outline"
              />
            }
          >
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2.5} />
          </MenuTrigger>
          <MenuPopup align="end" className="min-w-52">
            <MenuItem
              render={
                <a href={rawUrl} rel="noopener noreferrer" target="_blank">
                  <MarkdownMark className="size-4" />
                  View as Markdown
                </a>
              }
            />
            {assistants.map(({ Mark, label, url }) => (
              <MenuItem
                key={label}
                onClick={() => open(`${url}${prompt()}`)}
                render={
                  <button type="button">
                    <Mark className="size-4" />
                    {label}
                  </button>
                }
              />
            ))}
          </MenuPopup>
        </Menu>
      </Group>

      {previous || next ? (
        <Group>
          <Button
            aria-label={
              previous ? `Previous: ${previous.title}` : "No previous page"
            }
            disabled={!previous}
            render={previous ? <Link href={previous.url} /> : undefined}
            size="icon-xs"
            variant="outline"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.5} />
          </Button>
          <GroupSeparator />
          <Button
            aria-label={next ? `Next: ${next.title}` : "No next page"}
            disabled={!next}
            render={next ? <Link href={next.url} /> : undefined}
            size="icon-xs"
            variant="outline"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.5} />
          </Button>
        </Group>
      ) : null}
    </div>
  );
}
