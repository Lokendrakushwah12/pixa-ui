"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { AnimatePresence } from "framer-motion";
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

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
    <div className="flex items-center justify-center z-10 gap-1">
      <TooltipProvider>
        <Tooltip delayDuration={TOOLTIP_DELAY_DURATION}>
          <TooltipTrigger>
            <AnimatePresence mode="wait" initial={false}>
              <Button
                variant="ghost"
                className="size-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckIcon size={14} className="text-muted-foreground" />
                ) : (
                  <CopyIcon size={14} className="text-muted-foreground" />
                )}
              </Button>
            </AnimatePresence>
          </TooltipTrigger>
          <TooltipContent sideOffset={SIDE_OFFSET} side={TOOLTIP_SIDE}>
            <p className="rounded-md border bg-background p-1 px-2 text-sm">
              {copied ? "copied" : "copy"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Download Action */}
        <Tooltip delayDuration={TOOLTIP_DELAY_DURATION}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-7"
              onClick={handleDownload}
            >
              <DownloadIcon size={14} className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={SIDE_OFFSET} side={TOOLTIP_SIDE}>
            <p className="rounded-md border bg-background p-1 px-2 text-sm">
              download .tsx file
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ComponentActions;
