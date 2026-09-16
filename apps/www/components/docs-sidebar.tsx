"use client";

import * as HugeIcons from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PAGES_NEW } from "@/lib/docs";
import { cn } from "@/lib/utils";
import { Badge } from "@/registry/default/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/default/ui/sidebar";

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

const hugeIcons = HugeIcons as unknown as Record<string, HugeIcon | undefined>;

type TreeNode = {
  $id?: string;
  type: "page" | "folder" | "separator";
  name?: React.ReactNode;
  url?: string;
  icon?: string;
  children?: TreeNode[];
};

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: unknown }) {
  const pathname = usePathname();

  const treeData =
    typeof tree === "object" &&
    tree !== null &&
    "children" in tree &&
    Array.isArray(tree.children)
      ? (tree as { children: TreeNode[] })
      : { children: [] };

  return (
    <Sidebar
      className="sticky top-(--header-height) z-30 hidden h-[calc(100svh-var(--header-height))] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="px-4 py-2">
        <div className="h-(--top-spacing) shrink-0" />
        {treeData.children.map((item: TreeNode) => (
          <SidebarGroup className="gap-1" key={item.$id}>
            <SidebarGroupLabel className="h-7 px-0 text-sidebar-accent-foreground">
              {item.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {item.type === "folder" && (
                <SidebarMenu className="gap-0.5">
                  {item.children?.map((item: TreeNode, index: number) => {
                    if (item.type === "separator") {
                      return (
                        <SidebarMenuItem
                          key={`${item.$id ?? item.name}-${index}`}
                        >
                          <span
                            className={cn(
                              "flex h-7 items-center px-3.5 font-medium text-[0.6875rem] text-muted-foreground uppercase tracking-wide",
                              index > 0 && "mt-3",
                            )}
                          >
                            {item.name}
                          </span>
                        </SidebarMenuItem>
                      );
                    }
                    const IconComponent = item.icon
                      ? hugeIcons[item.icon]
                      : undefined;
                    return (
                      item.type === "page" && (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            className="ps-3.5 hover:bg-transparent active:bg-transparent"
                            isActive={item.url === pathname}
                            render={<Link href={item.url ?? "#"} />}
                          >
                            {IconComponent && (
                              <HugeiconsIcon
                                className="size-4"
                                icon={IconComponent}
                                strokeWidth={2}
                              />
                            )}
                            {item.name}
                            {PAGES_NEW.length > 0 &&
                              PAGES_NEW.includes(item.url as never) && (
                                <Badge variant="info">New</Badge>
                              )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    );
                  })}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
