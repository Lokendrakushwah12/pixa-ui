import { MDX } from "@/components/mdx";
import { getDocsMdx, getMetaConfig } from "@/lib/mdx";
import { ArrowUpRightIcon } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../ui/_components/Breadcrumbs";
import { Pagination } from "../ui/_components/Pagination";

const Docs = getDocsMdx("docs").sort((a, b) => a.title.localeCompare(b.title));

export async function generateMetadata(): Promise<Metadata | undefined> {
    const docs = Docs.find((docs) => docs.slug === "index");

    if (!docs) {
        return;
    }

    const { title, description } = docs;

    return {
        title,
        description,
        openGraph: {
            title: `${title}`,
            description,
            type: "website",
            url: `https://pixaui.com/docs`,
            images: [
                {
                    width: 1920,
                    height: 1080,
                    url: "https://pixaui.com/open-graphs/og-browse-components.png",
                    alt: "Pixa's website cover",
                },
            ],
        },
        twitter: {
            title: `${title}`,
            description,
            card: "summary_large_image",
            images: [
                {
                    width: 1920,
                    height: 1080,
                    url: "https://pixaui.com/open-graphs/og-browse-components.png",
                    alt: "Pixa's website cover",
                },
            ],
        },
    };
}

// Function to get the next component based on meta.json order
function getNextComponentFromMeta(): typeof Docs[0] | undefined {
    const metaConfig = getMetaConfig("docs");
    if (!metaConfig) return undefined;

    // Find the first non-category page after "index"
    const indexPosition = metaConfig.pages.indexOf("index");
    if (indexPosition === -1) return undefined;

    for (let i = indexPosition + 1; i < metaConfig.pages.length; i++) {
        const page = metaConfig.pages[i];
        // Skip category headings
        if (!page.startsWith('---')) {
            return Docs.find(doc => doc.slug === page);
        }
    }

    return undefined;
}

export default async function DocsHomePage() {
    const docs = Docs.find((docs) => docs.slug === "index");

    if (!docs) notFound();

    // Get the next component based on meta.json order
    const nextComponent = getNextComponentFromMeta();

    const { title, description, content, externalDocs, externalApi } = docs;

    return (
        <main className="my-2 mt-18">
            <div className="space-y-10">
                <div className="space-y-4">
                    <Breadcrumbs groupName="Docs" currentPage={title} />
                    <h1 className="text-3xl font-medium text-foreground">
                        {title}
                    </h1>
                    <p className="text-[16px] font-normal text-black/80 dark:text-white/90">
                        {description}
                    </p>
                    {externalDocs && !externalApi && (
                        <a
                            href={externalDocs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-fit text-xs text-neutral-700 dark:text-neutral-200 transition-all duration-200 border border-neutral-300 dark:border-neutral-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200/40 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800/60"
                        >
                            Docs
                            <ArrowIconGlitch />
                        </a>
                    )}
                    {externalApi && !externalDocs && (
                        <a
                            href={externalApi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-fit text-xs text-neutral-700 dark:text-neutral-200 transition-all duration-200 border border-neutral-300 dark:border-neutral-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200/40 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800/60"
                        >
                            Component API
                            <ArrowIconGlitch />
                        </a>
                    )}
                    {externalDocs && externalApi && (
                        <div className="flex items-center gap-2">
                            <a
                                href={externalDocs}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group text-xs text-neutral-700 dark:text-neutral-200 transition-all duration-200 border border-neutral-300 dark:border-neutral-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200/40 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800/60"
                            >
                                Docs
                                <ArrowIconGlitch />
                            </a>
                            <a
                                href={externalApi}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group text-xs text-neutral-700 dark:text-neutral-200 transition-all duration-200 border border-neutral-300 dark:border-neutral-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200/40 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800/60"
                            >
                                Component API
                                <ArrowIconGlitch />
                            </a>
                        </div>
                    )}
                </div>
                <div className="[&>*]:mb-4 [&>h2:has(+p)]:mb-2 [&>h2]:mt-8 [&>h2:first-child]:mt-0">
                    <MDX source={content} />
                </div>
                <Pagination
                    back={{
                        href: "",
                        title: "",
                    }}
                    next={{
                        href: nextComponent ? `/docs/${nextComponent.slug}` : "",
                        title: nextComponent ? nextComponent.title : "",
                    }}
                />
            </div>
        </main>
    );
}

function ArrowIconGlitch() {
    return (
        <div className="group relative overflow-hidden font-medium">
            <span className="invisible">
                <ArrowUpRightIcon size={10} />
            </span>
            <span className="absolute left-0 top-0 text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ease-in-out hover:duration-300 group-hover:-translate-y-full group-hover:translate-x-full">
                <ArrowUpRightIcon size={10} />
            </span>
            <span className="absolute left-0 top-0 -translate-x-full translate-y-full text-primary transition-transform duration-300 ease-in-out hover:duration-300 group-hover:translate-x-0 group-hover:translate-y-0">
                <ArrowUpRightIcon size={10} />
            </span>
        </div>
    );
}