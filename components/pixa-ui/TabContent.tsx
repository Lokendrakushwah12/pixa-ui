import React from "react";
import TabButton from "./TabButton";
import { tabs } from "@/types/types";

interface TabContentProps {
  active: (typeof tabs)[number];
}

const TabContent: React.FC<TabContentProps> = ({ active }) => {
  switch (active) {
    case "Button":
      return <TabButton />;
    case "Cards":
      return <h2>Cards Content</h2>;
    case "Tabs":
      return <h2>Tabs Content</h2>;
    case "Modals":
      return <h2>Modals Content</h2>;
    case "Miscellaneous":
      return <h2>Miscellaneous Content</h2>;
    default:
      return null;
  }
};

export default TabContent;
