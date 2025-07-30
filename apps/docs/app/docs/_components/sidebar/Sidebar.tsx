import { getDocsMdx, getMetaConfig } from "@/lib/mdx";
import { SidebarButton } from "./SidebarButton";

// Define the structure for grouped docs
interface GroupedDocs {
  [category: string]: Array<{
    title: string;
    slug: string;
    icon?: string;
    isNew?: boolean;
  }>;
}

export const getMDXdocs = getDocsMdx("docs").sort((a, b) =>
  a.title.localeCompare(b.title),
);

// Function to group docs based on meta.json structure
function groupDocsFromMeta(): GroupedDocs {
  const metaConfig = getMetaConfig("docs");
  const grouped: GroupedDocs = {};

  if (!metaConfig) {
    // Fallback to simple grouping if meta.json is not available
    getMDXdocs.forEach((doc) => {
      if (!grouped['Docs']) {
        grouped['Docs'] = [];
      }
      grouped['Docs'].push({
        title: doc.title,
        slug: doc.slug,
        icon: doc.icon,
        isNew: doc.isNew,
      });
    });
    return grouped;
  }

  let currentCategory = 'Default';

  metaConfig.pages.forEach((page) => {
    // Check if this is a category heading (starts and ends with ---)
    if (page.startsWith('---') && page.endsWith('---')) {
      currentCategory = page.replace(/---/g, '').trim();
      if (!grouped[currentCategory]) {
        grouped[currentCategory] = [];
      }
      return;
    }

    // Find the corresponding MDX doc
    const doc = getMDXdocs.find((d) => d.slug === page);
    if (doc) {
      if (!grouped[currentCategory]) {
        grouped[currentCategory] = [];
      }

      grouped[currentCategory].push({
        title: doc.title,
        slug: doc.slug,
        icon: doc.icon,
        isNew: doc.isNew,
      });
    }
  });

  return grouped;
}

export function Sidebar() {
  const groupedDocs = groupDocsFromMeta();
  const categories = Object.keys(groupedDocs);

  console.log("Cat", groupedDocs)

  return (
    <aside className="sticky w-full block shrink-0 top-16 max-md:hidden">
      <nav className="flex flex-col h-full gap-6 overflow-y-auto py-8 px-6 no-scrollbar">
        {categories.map((category) => (
          <div key={category} className="flex flex-col gap-1">
            <span className="relative z-[1] -ml-0.5 text-sm font-[460] text-foreground">
              {category}
            </span>
            <div className="flex flex-col pb-4 ml-2">
              {groupedDocs[category].map((doc) => (
                <SidebarButton
                  key={doc.title}
                  name={doc.title}
                  slug={`/docs/${doc.slug}`}
                  icon={doc.icon}
                  isNew={doc.isNew}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}