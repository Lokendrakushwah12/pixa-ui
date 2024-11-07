"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon, Download, DownloadIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

const SIDE_OFFSET = 5;
const TOOLTIP_DELAY_DURATION = 200;
const TOOLTIP_SIDE = "bottom";

const ComponentActions = ({
  code,
  componentName,
}: {
  code: string;
  componentName: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${componentName}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <TooltipProvider>
        <Tooltip delayDuration={TOOLTIP_DELAY_DURATION}>
          <TooltipTrigger>
            <AnimatePresence mode="wait" initial={false}>
              <button
                className="rounded-sm p-[3px] transition-all hover:bg-[var(--border-hover)]"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckIcon size={14} className="text-[#777]" />
                ) : (
                  <CopyIcon size={14} className="text-[#777]" />
                )}
              </button>
            </AnimatePresence>
          </TooltipTrigger>
          <TooltipContent sideOffset={SIDE_OFFSET} side={TOOLTIP_SIDE}>
            <p className="rounded-md border border-[var(--border)] bg-[var(--button-secondary)] p-1 px-2 text-sm">
              {copied ? "copied" : "copy"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Download Action */}
        <Tooltip delayDuration={TOOLTIP_DELAY_DURATION}>
          <TooltipTrigger asChild>
            <button
              className="flex h-5 w-5 items-center justify-center rounded-sm transition-all hover:bg-[var(--border-hover)]"
              onClick={handleDownload}
            >
              <DownloadIcon size={14} className="text-[#777]" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={SIDE_OFFSET} side={TOOLTIP_SIDE}>
            <p className="rounded-md border border-[var(--border)] bg-[var(--button-secondary)] p-1 px-2 text-sm">
              download .tsx file
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ComponentActions;
