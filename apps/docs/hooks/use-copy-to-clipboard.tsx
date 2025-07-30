"use client";
import { useState } from "react";

interface UseCopyToClipboardProps {
  timeout?: number;
}

export function useCopyToClipboard({
  timeout = 2000,
}: UseCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
}
