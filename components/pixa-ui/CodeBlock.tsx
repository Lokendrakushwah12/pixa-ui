"use client";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckIcon, ChevronDown, ChevronUp, CopyIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coldarkDark,
  prism,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

export const programmingLanguages = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
  tsx: ".tsx",
  bash: ".sh",
  // add more file extensions here
};

const CodeBlock = memo(function CodeBlock({
  language,
  value,
}: {
  language: keyof typeof programmingLanguages;
  value: string;
}) {
  const { theme } = useTheme();
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [expanded, setExpanded] = useState(false);

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(value);
  };

  const syntaxTheme = theme === "light" ? prism : coldarkDark;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-background font-sans">
      {/* Header */}
      <div className="flex w-full items-center justify-between border-b bg-button-secondary px-4 py-2 text-foreground">
        <span className="text-xs lowercase text-muted-foreground">{language}</span>
        <div className="flex items-center space-x-1">
          <button
            className="rounded-sm p-[3px] transition-all hover:bg-[#ffffff1d]"
            onClick={onCopy}
          >
            {isCopied ? (
              <CheckIcon size={14} className="text-muted-foreground" />
            ) : (
              <CopyIcon size={14} className="text-muted-foreground" />
            )}
            <span className="sr-only">Copy code</span>
          </button>
        </div>
      </div>

      {/* Code container with show more */}
      <div className="relative">
        <div
          className={`overflow-y-auto transition-max-height ${expanded ? "max-h-[2000px]" : "max-h-[400px]"}`}
        >
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            PreTag="div"
            showLineNumbers
            customStyle={{
              margin: 0,
              width: "100%",
              background: "transparent",
              padding: "0.5rem",
            }}
            codeTagProps={{
              style: {
                fontSize: "0.9rem",
                fontFamily: "var(--font-mono)",
              },
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>

        {/* Gradient & Button overlay */}
        {!expanded && value.split("\n").length > 20 && (
          <div className="absolute bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-background to-transparent pt-12">
            <button
              className="flex items-center cursor-pointer gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition"
              onClick={() => setExpanded(true)}
            >
              Show more <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Show less button */}
      {expanded && value.split("\n").length > 20 && (
        <div className="flex justify-center px-4 pb-2">
          <button
            className="flex items-center cursor-pointer gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition"
            onClick={() => setExpanded(false)}
          >
            Show less <ChevronUp size={14} />
          </button>
        </div>
      )}
    </div>

  );
});

export default CodeBlock;
