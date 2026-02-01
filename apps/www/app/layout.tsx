import "./globals.css";

import { fontHeading, fontMono, fontSans } from "@pixa/ui/fonts";
import { SiteFooter } from "@pixa/ui/shared/site-footer";
import { SiteHeader } from "@pixa/ui/shared/site-header";
import { ThemeProvider } from "@pixa/ui/shared/theme-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "pixaui.com - the everything but AI company",
  metadataBase: new URL("https://pixaui.com"),
  title: "pixaui.com",
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
            <div
              aria-hidden="true"
              className="before:-left-3 after:-right-3 container pointer-events-none absolute inset-0 z-45 before:absolute before:inset-y-0 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:w-px after:bg-border/64"
            />
            <div
              aria-hidden="true"
              className="before:-left-[11.5px] before:-ml-1 after:-right-[11.5px] after:-mr-1 container pointer-events-none fixed inset-0 z-45 before:absolute before:top-[calc(var(--header-height)-4.5px)] before:z-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs after:absolute after:top-[calc(var(--header-height)-4.5px)] after:z-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs dark:after:bg-clip-border dark:before:bg-clip-border"
            />
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
