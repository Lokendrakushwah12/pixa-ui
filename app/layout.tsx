import type { Metadata } from "next";
import { uncutsans } from "./fonts";
import { Providers } from "@/components/theme/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixa UI - Curated collection of versatile React.js/Next.js components",
  description:
    "A Collection of Open Source Components for React + TailwindCSS for your Project. Curated collection of versatile React.js/Next.js components.Crafted with Tailwind CSS to accelerate your development speed.",
  keywords: "React, Next.js, Tailwind CSS, UI components, open source",
  robots: "index, follow",
  openGraph: {
    title: "Pixa UI",
    description:
      "Curated collection of versatile React.js/Next.js components.Crafted with Tailwind CSS to accelerate your development speed.",
    url: "https://pixa-ui-dev.vercel.app/",
    images: [
      {
        url: "/assets/og.png",
        alt: "Pixa UI",
      },
    ],
    siteName: "Pixa UI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixa UI",
    description:
      "A Collection of Open Source Components for React + TailwindCSS for your Project.",
    images: [
      {
        url: "/assets/og.png",
        alt: "Pixa UI",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/svg/logo.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={` ${uncutsans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
