import { MDX } from "@/components/mdx";
import { getDocsMdx, getMetaConfig } from "@/lib/mdx";
import { ArrowUpRightIcon } from "lucide-react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "../../ui/_components/Breadcrumbs";
import { Pagination } from "../../ui/_components/Pagination";

const Docs = getDocsMdx("docs").sort((a, b) => a.title.localeCompare(b.title));

export async function generateStaticParams() {
    return Docs
        .filter((docs) => docs.slug !== "index") // Exclude index from static params
        .map((docs) => ({
            slug: docs.slug,
        }));
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
    const { slug } = await params;

    // Redirect index to /docs
    if (slug === "index") {
        return undefined;
    }

    const docs = Docs.find((docs) => docs.slug === slug);

    if (!docs) {
        return;
    }

    const { title, description, slug: slugDocs } = docs;

    return {
        title,
        description,
        openGraph: {
            title: `${title}`,
            description,
            type: "website",
            url: `https://pixaui.com/docs/${slugDocs}`,
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

// Function to get previous and next components based on meta.json order
function getPaginationFromMeta(currentSlug: string) {
    const metaConfig = getMetaConfig("docs");
    if (!metaConfig) {
        // Fallback to alphabetical order if no meta.json
        const currentIndex = Docs.findIndex(doc => doc.slug === currentSlug);
        const previous = Docs[currentIndex - 1];
        const next = Docs[currentIndex + 1];

        return {
            previous: previous ? {
                href: previous.slug === "index" ? "/docs" : `/docs/${previous.slug}`,
                title: previous.title
            } : { href: "", title: "" },
            next: next ? {
                href: next.slug === "index" ? "/docs" : `/docs/${next.slug}`,
                title: next.title
            } : { href: "", title: "" },
        };
    }

    const nonCategoryPages = metaConfig.pages.filter(page => !page.startsWith('---'));
    const currentIndex = nonCategoryPages.indexOf(currentSlug);

    if (currentIndex === -1) {
        return {
            previous: { href: "", title: "" },
            next: { href: "", title: "" }
        };
    }

    const previousSlug = nonCategoryPages[currentIndex - 1];
    const nextSlug = nonCategoryPages[currentIndex + 1];

    const previousDoc = previousSlug ? Docs.find(doc => doc.slug === previousSlug) : undefined;
    const nextDoc = nextSlug ? Docs.find(doc => doc.slug === nextSlug) : undefined;

    return {
        previous: previousDoc ? {
            href: previousDoc.slug === "index" ? "/docs" : `/docs/${previousDoc.slug}`,
            title: previousDoc.title
        } : { href: "", title: "" },
        next: nextDoc ? {
            href: nextDoc.slug === "index" ? "/docs" : `/docs/${nextDoc.slug}`,
            title: nextDoc.title
        } : { href: "", title: "" },
    };
}

export default async function DocsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (slug === "index") {
        redirect("/docs");
    }

    const docs = Docs.find((docs) => docs.slug === slug);

    if (!docs) notFound();

    const pagination = getPaginationFromMeta(slug);

    const { title, description, content, externalDocs, externalApi } = docs;

    return (
        <main className="my-2 mt-18">
            <div className="space-y-10">
                <div className="space-y-4">
                    <Breadcrumbs groupName="Docs" currentPage={title} />
                    <h1 className="text-3xl font-medium text-foreground">
                        {title}
                    </h1>
                    <p className="text-[16px] font-normal leading-relaxed text-black/80 dark:text-white/90">
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
                <MDX source={content} />
                <Pagination
                    back={pagination.previous}
                    next={pagination.next}
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