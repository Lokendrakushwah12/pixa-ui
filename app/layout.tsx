import SunBackdrop from "@/components/ui/sun-back-drop";
import { geistMono, hostGrotesk } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "pixa-ui",
  description: "pixa-ui",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "pixa-ui",
    description: "pixa-ui",
    url: "https://pixaui.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "pixa-ui",
    description: "pixa-ui",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${hostGrotesk.variable} ${geistMono.variable} font-mono antialiased bgcustom min-h-svh`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
        <SunBackdrop />
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
