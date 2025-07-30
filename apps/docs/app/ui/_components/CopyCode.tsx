"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";


import { CheckIcon } from "lucide-react";

type CopyCode = {
  code: string;
  example?: boolean;
  mode?: "text" | "icon";
};

export function CopyCode({ code }: CopyCode) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="relative flex gap-0.5 size-7 items-center justify-center rounded-md text-foreground outline-none dark:text-neutral-500 dark:focus-visible:ring-neutral-800"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            className="ml-px"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{
              ease: "easeOut",
              duration: 0.15,
            }}
          >
            <CheckIcon size={14} className="text-primary" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="ml-px"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{
              ease: "easeOut",
              duration: 0.15,
            }}
          >
            <Icon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function Icon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover/copy-button:text-gray-500 dark:text-white/40 dark:group-hover/copy-button:text-white/60"><path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  );
}
