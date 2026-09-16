"use client";

import { useState } from "react";
import { Badge } from "@/registry/default/ui/badge";
import type { CommandMenuItemData } from "@/registry/default/ui/command-menu";
import {
  CommandMenu,
  CommandMenuEmpty,
  CommandMenuInput,
  CommandMenuList,
} from "@/registry/default/ui/command-menu";

const commandItems: CommandMenuItemData[] = [
  {
    description: "Blank document",
    label: "New file",
    shortcut: "mod+n",
    value: "new",
  },
  {
    description: "Account and workspace",
    label: "Settings",
    shortcut: "mod+,",
    value: "settings",
  },
  {
    description: "Files, people, messages",
    label: "Search everywhere",
    value: "search",
  },
  {
    description: "System, light, or dark",
    label: "Toggle dark mode",
    value: "theme",
  },
  {
    description: "Send an email invite",
    label: "Invite people",
    value: "invite",
  },
  { label: "Export as PDF", value: "export" },
];

export default function Particle() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <>
      <div className="w-full max-w-md rounded-xl border border-border">
        <CommandMenu items={commandItems} onSelect={(i) => setPicked(i.label)}>
          <CommandMenuInput placeholder="Search actions…" />
          <CommandMenuList />
          <CommandMenuEmpty>No matching action.</CommandMenuEmpty>
        </CommandMenu>
      </div>
      {picked && <Badge color="green">{picked}</Badge>}
    </>
  );
}
