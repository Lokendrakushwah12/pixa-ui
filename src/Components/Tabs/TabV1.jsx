import React from "react";
import { motion } from "framer-motion";

const TabV1 = ({ tabs }) => {
  const [active, setActive] = React.useState(tabs[0]?.name || "Button"); // Default to the first tab

  return (
    <div>
      <div className="mb-8 flex flex-col w-full gap-2 xsm">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActive(tab.name)}
            className={`${
              active === tab.name ? "text-[#212121]" : "text-[#515151]"
            } relative px-2 py-1 text-sm text-left font-medium hover:text-[#212121] transition-all duration-300`}
          >
            <div className="flex items-center justify-start gap-2">
              <div className="text-black z-20">
                {tab.icon && (
                  <tab.icon
                    width="24"
                    height="24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  />
                )}
              </div>
              <span className="relative z-10 text-lg font-[500] xsm">
                {tab.name}
              </span>
            </div>
            {active === tab.name && (
              <motion.div
                className="absolute left-0 bottom-0 flex size-full"
                layoutId="underline"
                transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              >
                <span className="z-0 h-full w-full bg-[#f5f5f5] rounded-lg"></span>
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabV1;