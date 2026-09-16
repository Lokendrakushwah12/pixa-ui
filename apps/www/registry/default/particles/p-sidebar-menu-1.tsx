"use client";

import { CalendarDays, House, Settings } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/default/ui/sidebar-menu";

const items = [
  { badge: null, icon: House, label: "Home" },
  { badge: "3", icon: CalendarDays, label: "Schedule" },
  { badge: null, icon: Settings, label: "Settings" },
];

export default function Particle() {
  return (
    <div className="w-full max-w-56">
      <SidebarMenu>
        {items.map((item, i) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton icon={item.icon} isActive={i === 0}>
              {item.label}
            </SidebarMenuButton>
            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
