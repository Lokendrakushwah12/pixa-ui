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
      if (folder.type === "folder" && folder.children) {
        return {
          ...folder,
          children: folder.children.map((item: unknown) => {
            if (item.type === "page") {
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
