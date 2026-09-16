"use client";

import { useState } from "react";
import { TabsSubtle, TabsSubtleItem } from "@/registry/default/ui/tabs-subtle";

export default function Particle() {
  const [index, setIndex] = useState(0);
  return (
    <TabsSubtle onSelect={setIndex} selectedIndex={index}>
      <TabsSubtleItem index={0} label="Home" />
      <TabsSubtleItem index={1} label="Inbox" />
      <TabsSubtleItem index={2} label="Archive" />
    </TabsSubtle>
  );
}
