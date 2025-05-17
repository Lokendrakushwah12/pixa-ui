"use client";
import { motion } from "framer-motion";
import React from "react";
import TabContent from "./TabContent";


const tabs = ["Button", "Cards", "Tabs", "Modals", "Miscellaneous"] as const;
type TabType = (typeof tabs)[number];

const ComponentsTabs = () => {
  const [active, setActive] = React.useState<TabType>(tabs[0]);

  return (
    <div className="mb-12 flex w-full flex-col items-center justify-start gap-4">
      <div className="scroll relative flex max-w-7xl items-center no-scrollbar overflow-x-auto px-3">
        {tabs.map((text, index) => (
          <React.Fragment key={text}>
            <button
              onClick={() => setActive(text)}
              className={`relative cursor-pointer rounded-md px-2 py-1 text-sm font-[400] transition-all duration-300 ${active === text
                ? "text-foreground"
                : "text-muted-foreground"
                } hover:text-foreground`}
            >
              <span className="relative z-10 text-lg">{text}</span>
              {active === text && (
                <motion.div
                  className="absolute bottom-0 left-0 flex h-full w-full items-end justify-center"
                  layoutId="underline"
                  transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
                >
                  <span className="z-0 h-[3px] w-3/4 rounded-t-sm bg-foreground"></span>
                </motion.div>
              )}
            </button>
            <div className="absolute bottom-0 border-muted-foreground/10 w-[98%] border-b"></div>

          </React.Fragment>
        ))}
      </div>
      <div className="grid w-full max-w-3xl mx-auto grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TabContent active={active} />
      </div>
    </div>
  );
};

export default ComponentsTabs;
