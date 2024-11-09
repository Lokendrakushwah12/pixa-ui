"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export const PropInformation = ({ content }: { content: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div
          className={clsx(
            "relative cursor-pointer before:absolute before:left-0 before:top-0 before:-z-[1] before:h-full before:w-full before:scale-75 before:rounded-md before:bg-transparent before:transition-all before:content-['']",
            "hover:text-foreground hover:before:scale-100 hover:before:bg-[var(--scroll-color)]",
            "text-muted z-[0] flex h-[24px] w-[24px] items-center justify-center rounded-md bg-transparent transition-all",
          )}
        >
          <InfoCircledIcon />
        </div>
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <Popover.Content
              side="top"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -5 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  type: "spring",
                  ease: "easeInOut",
                  duration: 0.2,
                }}
                className="inline-block max-w-96 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--button-secondary)] px-3 py-2 text-sm leading-[18px] text-neutral-400 shadow"
              >
                {content}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
