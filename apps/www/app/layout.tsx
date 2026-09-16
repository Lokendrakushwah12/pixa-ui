import "./globals.css";

import { fontHeading, fontMono, fontSans } from "@pixa/ui/fonts";
import { SiteFooter } from "@pixa/ui/shared/site-footer";
import { SiteHeader } from "@pixa/ui/shared/site-header";
import { ThemeProvider } from "@pixa/ui/shared/theme-provider";
import type { Metadata } from "next";

import { InlineScript } from "@/components/inline-script";

export const metadata: Metadata = {
  description: "pixa ui - Build faster with beautifully crafted components",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://pixaui.com"),
  openGraph: {
    images: [
      {
        alt: "pixa ui",
        height: 630,
        url: "https://pixaui.com/og.png",
        width: 1200,
      },
    ],
  },
  title: "pixa ui",
  twitter: {
    card: "summary_large_image",
    creator: "@pixa_ui",
    description: "pixa ui - Build faster with beautifully crafted components",
    images: ["https://pixaui.com/og.png"],
    title: "pixa ui",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before paint to avoid a flash. InlineScript
            swaps its type on the client so it doesn't trip React 19's dev
            "script tag" warning. */}
        <InlineScript
          html={`(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light'}catch(e){}})()`}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} relative bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <div className="relative isolate flex min-h-svh flex-col overflow-clip [--header-height:4rem]">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
