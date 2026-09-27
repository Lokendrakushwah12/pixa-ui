"use client";

import { useState } from "react";
import {
  TabItem,
  TabPanel,
  Tabs,
  TabsList,
} from "@/registry/default/ui/fluid-tabs";

export default function Particle() {
  const [tab, setTab] = useState("overview");
  return (
    <div className="w-full max-w-md">
      <Tabs onValueChange={setTab} value={tab}>
        <TabsList>
          <TabItem label="Overview" value="overview" />
          <TabItem label="Analytics" value="analytics" />
          <TabItem label="Settings" value="settings" />
        </TabsList>
        <TabPanel value="overview">
          <p className="pt-3 text-[13px] text-muted-foreground">
            The indicator slides.
          </p>
        </TabPanel>
        <TabPanel value="analytics">
          <p className="pt-3 text-[13px] text-muted-foreground">
            Weight shifts without reflow.
          </p>
        </TabPanel>
        <TabPanel value="settings">
          <p className="pt-3 text-[13px] text-muted-foreground">
            Fluid hover previews the target.
          </p>
        </TabPanel>
      </Tabs>
    </div>
  );
}
