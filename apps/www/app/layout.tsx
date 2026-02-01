import "./globals.css";

import { fontHeading, fontMono, fontSans } from "@pixa/ui/fonts";
import { SiteFooter } from "@pixa/ui/shared/site-footer";
import { SiteHeader } from "@pixa/ui/shared/site-header";
import { ThemeProvider } from "@pixa/ui/shared/theme-provider";
import type { Metadata } from "next";

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
