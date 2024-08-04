import React from "react";
import { motion } from "framer-motion";

const TabV2 = ({
  tabs,
  textColor = "text-[#414141]",
  hoverTextColor = "hover:text-[#212121]",
  tabBorderRadius = "rounded-lg",
  tabHoverColor = "bg-[#f5f5f5]",
  className = "",
}) => {
  const [active, setActive] = React.useState(tabs[0].name);

  return (
    <div
      className={`flex flex-row items-center justify-center gap-2 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActive(tab.name)}
          className={`${
            active === tab.name ? `${textColor}` : `${hoverTextColor}`
          } group ${textColor} ${hoverTextColor} relative px-2 py-1 text-left text-sm font-medium transition-all duration-300 hover:opacity-100`}
        >
          <div className="flex items-center justify-start gap-2">
            <div
              className={`${
                active === tab.name ? "opacity-100" : "opacity-80"
              } z-20 transition-all duration-300 group-hover:opacity-100`}
            >
              {tab?.icon && (
                <tab.icon
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                />
              )}
            </div>
            <span className="xsm relative z-10 text-lg font-[500]">
              {tab.name}
            </span>
          </div>
          {active === tab.name && (
            <motion.div
              className="absolute bottom-0 left-0 flex size-full"
              layoutId={tabs[0].name}
              transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            >
              <span
                className={` ${tabHoverColor} z-0 h-full w-full ${tabBorderRadius}`}
              ></span>
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabV2;
