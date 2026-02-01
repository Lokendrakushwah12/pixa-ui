import { DocsSidebar } from "@/components/docs-sidebar";
import { source } from "@/lib/source";
import { SidebarProvider } from "@/registry/default/ui/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enrichedTree = {
    ...source.pageTree,
    children: source.pageTree.children.map((folder: unknown) => {
      // Type guard for folder
      if (
        typeof folder === "object" &&
        folder !== null &&
        "type" in folder &&
        folder.type === "folder" &&
        "children" in folder &&
        Array.isArray(folder.children)
      ) {
        return {
          ...folder,
          children: folder.children.map((item: unknown) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "type" in item &&
              item.type === "page" &&
              "url" in item &&
              typeof item.url === "string" &&
              "name" in item
            ) {
              let pagePath: string[] | undefined;
              if (item.url === "/docs") {
                pagePath = undefined;
              } else {
                pagePath = item.url
                  .replace(/^\/docs\//, "")
                  .split("/")
                  .filter(Boolean);
              }
              const page = source.getPage(pagePath);
              const icon = page?.data.icon;
              console.log(
                `[Layout] Page: ${item.name}, URL: ${item.url}, Path: ${JSON.stringify(pagePath)}, Icon: ${icon}`,
              );
              return {
                ...item,
                icon: icon,
              };
            }
            return item;
          }),
        };
      }
      return folder;
    }),
  };

  return (
    <main className="flex flex-1 flex-col bg-sidebar/30">
      <SidebarProvider className="container min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
        <DocsSidebar tree={enrichedTree} />
        <div className="h-full w-full">{children}</div>
      </SidebarProvider>
    </main>
  );
}
