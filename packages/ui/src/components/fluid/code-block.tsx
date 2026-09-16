"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";

import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";

const cssVarTheme: PrismTheme = {
  plain: { color: "var(--foreground)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--code-comment)", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "var(--code-punctuation)" } },
    { types: ["keyword", "operator", "boolean", "atrule", "rule"], style: { color: "var(--code-keyword)" } },
    { types: ["string", "char", "attr-value", "regex"], style: { color: "var(--code-string)" } },
    { types: ["number", "constant", "symbol"], style: { color: "var(--code-number)" } },
    { types: ["function", "class-name", "maybe-class-name"], style: { color: "var(--code-function)" } },
    { types: ["tag", "selector"], style: { color: "var(--code-tag)" } },
    { types: ["attr-name", "property", "variable"], style: { color: "var(--code-attr)" } },
    { types: ["deleted"], style: { color: "var(--code-deleted)" } },
    { types: ["inserted"], style: { color: "var(--code-inserted)" } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxLines?: number;
  className?: string;
  children?: ReactNode;
}

function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  highlightLines,
  maxLines,
  className,
}: CodeBlockProps) {
  const shape = useShape();
  const CopyIcon = useIcon("copy");
  const CheckIcon = useIcon("check");
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(
    () => new Set(highlightLines ?? []),
    [highlightLines]
  );

  const source = useMemo(() => code.replace(/\n+$/, ""), [code]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard is permission-gated and blocked outright in some embeds.
      // Failing silently is right here: the code is already on screen and
      // selectable, so there is nothing the reader needs to be told.
    }
  }, [source]);

  return (
    <div
      data-slot="code-block"
      className={cn("overflow-hidden border border-border bg-muted/30", shape.container, className)}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        <span className="truncate text-[12px] text-muted-foreground">
          {filename ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "ml-auto rounded-md p-1 text-muted-foreground",
            "transition-colors duration-100 hover:text-foreground",
            "outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "[&>svg]:size-3.5"
          )}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>

      <Highlight theme={cssVarTheme} code={source} language={language}>
        {({ className: preClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn("overflow-auto p-3 text-[12px] leading-relaxed", preClass)}
            style={{
              ...style,
              maxHeight: maxLines ? `calc(${maxLines} * 1.625 * 12px + 1.5rem)` : undefined,
            }}
          >
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div
                    key={i}
                    {...lineProps}
                    className={cn(
                      "table-row",
                      highlighted.has(i + 1) && "bg-primary/8"
                    )}
                  >
                    {showLineNumbers && (
                      <span className="table-cell select-none pr-4 text-right text-muted-foreground/60 tabular-nums">
                        {i + 1}
                      </span>
                    )}
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export { CodeBlock };
export type { CodeBlockProps };
