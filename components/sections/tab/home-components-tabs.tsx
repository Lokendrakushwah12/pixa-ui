"use client";
import { AnimatedTabs } from "@/app/tabs/1/animated-tabs";
import { tabComponents } from "./tab-components";

const tabs = ["Buttons", "Cards", "Tabs", "Dialogs", "Extra"] as const;

const HomeComponentsTabs = () => {
  return (
    <div className="mb-12 flex w-full flex-col items-center justify-start">
      <AnimatedTabs
        defaultValue="Buttons"
        className="w-full flex flex-col items-center justify-start"
      >
        <AnimatedTabs.List className="scroll sticky top-6 w-fit max-w7xl no-scrollbar z-[999] flex rounded-xl border bg-background p-1 backdrop-blur-lg">
          {tabs.map((tab) => (
            <AnimatedTabs.Trigger
              key={tab}
              value={tab}
              className="text-sm whitespace-nowrap"
            >
              {tab}
            </AnimatedTabs.Trigger>
          ))}
        </AnimatedTabs.List>

        {tabs.map((tab) => (
          <AnimatedTabs.Content
            key={tab}
            value={tab}
            className="w-full mx-auto"
          >
            {tabComponents[tab]}
          </AnimatedTabs.Content>
        ))}
      </AnimatedTabs>
    </div>
  );
};

export default HomeComponentsTabs;