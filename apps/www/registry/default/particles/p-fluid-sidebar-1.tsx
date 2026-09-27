"use client";

import { House, Inbox, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/default/ui/fluid-sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/default/ui/sidebar-menu";

const items = [
  { icon: House, label: "Home" },
  { icon: Inbox, label: "Inbox" },
  { icon: Settings, label: "Settings" },
];

export default function Particle() {
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-border">
      <SidebarProvider peek="hover">
        <Sidebar>
          <SidebarHeader>
            <span className="px-2 font-medium text-[13px]">Acme</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {items.map((item, i) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton icon={item.icon} isActive={i === 0}>
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-border border-b px-4">
            <SidebarTrigger />
            <span className="text-[13px] text-muted-foreground">
              Inset content
            </span>
          </header>
          <div className="flex flex-1 items-center justify-center text-[12px] text-muted-foreground">
            Your page goes here
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
