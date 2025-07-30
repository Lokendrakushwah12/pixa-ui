import { Metadata } from "next";

import { OnThisPage } from "../ui/_components/OnThisPage";
import { Sidebar } from "./_components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Docs",
    template: "%s",
  },
  description: "Browse through a curated collection of versatile Next.js components that will make your application beautiful.",
  openGraph: {
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://pixaui.com/open-graphs/og-browse-components.png",
        alt: "Pixa's website cover",
      },
    ],
    locale: "en",
    siteName: "Lokendra Kushwah",
    title: "Docs",
  description: "Browse through a curated collection of versatile Next.js components that will make your application beautiful.",
    type: "website",
    url: "https://pixaui.com/ui",
  },
  twitter: {
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://pixaui.com/open-graphs/og-browse-components.png",
        alt: "Pixa's website cover",
      },
    ],
    card: "summary_large_image",
    title: "Docs",
  description: "Browse through a curated collection of versatile Next.js components that will make your application beautiful.",
    site: "@lokendra",
    creator: "Lokendra Kushwah",
  },
};

type DocsPageLayout = {
  children: React.ReactNode;
};

export default function DocsPageLayout({ children }: DocsPageLayout) {
  return (
    <div className="max-w-7xl mx-auto flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
      <Sidebar />
      <div className="relative xl:grid xl:grid-cols-[1fr_190px]">
        <div className="mx-auto w-full min-w-0 max-w-[640px] mt-6 max-md:px-6 mb-16 sm:mb-20">
          {children}
        </div>
        <OnThisPage />
      </div>
    </div>
  );
}
