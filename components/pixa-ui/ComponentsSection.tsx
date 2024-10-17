"use client";
import React from "react";
import { motion } from "framer-motion";

const tabs = ["Button", "Cards", "Tabs", "Modals", "Miscellaneous"];

const ComponentsSection = () => {
  const [active, setActive] = React.useState(tabs[0]);

  return (
    <div className="mb-12 mt-44 flex w-full flex-col items-center justify-start gap-4">
      <div className="flex max-w-7xl flex-wrap items-center gap-2 border-b border-gray-200 px-3 dark:border-[#515151]">
        {tabs.map((text) => (
          <button
            key={text}
            onClick={() => setActive(text)}
            className={`relative rounded-md px-2 py-1 text-sm font-[400] transition-all duration-300 ${
              active === text
                ? "text-background dark:text-[#fff]"
                : "text-[#515151] dark:text-[#777]"
            } hover:text-background dark:hover:text-foreground`}
          >
            <span className="relative z-10 text-lg">{text}</span>
            {active === text && (
              <motion.div
                className="absolute bottom-0 left-0 flex h-full w-full items-end justify-center"
                layoutId="underline"
                transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              >
                <span className="z-0 h-[3px] w-3/4 rounded-t-sm bg-background dark:bg-foreground"></span>
              </motion.div>
            )}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-4 py-24 text-left text-lg font-[400] tracking-tight text-neutral-800 dark:text-neutral-500">
          {active}
        </div>
      </div>
    </div>
  );
};

export default ComponentsSection;
