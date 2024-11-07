"use client";
import React from "react";
import { motion } from "framer-motion";
import ComponentSection from "./ComponentSection";
import TabContent from "./TabContent";
import Container from "../animation/container";

const tabs = ["Button", "Cards", "Tabs", "Modals", "Miscellaneous"] as const;
type TabType = (typeof tabs)[number];

const ComponentsTabs = () => {
  const [active, setActive] = React.useState<TabType>(tabs[0]);

  return (
    <div className="mb-12 mt-[2rem] flex w-full flex-col items-center justify-start gap-4">
      <Container delay={0.3}>
        <div className="scroll relative flex max-w-7xl items-center overflow-x-auto px-3">
          {tabs.map((text) => (
            <>
              <button
                key={text}
                onClick={() => setActive(text)}
                className={`relative rounded-md px-2 py-1 text-sm font-[400] transition-all duration-300 ${
                  active === text
                    ? "text-[var(--text-secondary-hover)]"
                    : "text-[var(--text-secondary)]"
                } hover:text-foreground`}
              >
                <span className="relative z-10 text-lg">{text}</span>
                {active === text && (
                  <motion.div
                    className="absolute bottom-0 left-0 flex h-full w-full items-end justify-center"
                    layoutId="underline"
                    transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
                  >
                    <span className="z-0 h-[3px] w-3/4 rounded-t-sm bg-[var(--text-secondary)]"></span>
                  </motion.div>
                )}
              </button>
              <div className="absolute bottom-2 w-[98%] border-b border-[var(--border)]"></div>
            </>
          ))}
        </div>
      </Container>
      <Container delay={0.4}>
        <div className="mb-4 text-left text-lg font-[400] tracking-tight text-neutral-800 dark:text-neutral-500">
          <ComponentSection>
            <TabContent active={active} />
          </ComponentSection>
        </div>
      </Container>
    </div>
  );
};

export default ComponentsTabs;
