import { geistMono, hostGrotesk } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./ui/_components/Header";

export const metadata: Metadata = {
  title: "Pixa/ui",
  description: "Pixa/ui - Curated collection of versatile Next.js components",
  keywords: [
    "pixa-ui",
    "pixa",
    "pixa-ui components",
    "pixa-ui nextjs",
    "pixa-ui library",
    "pixa-ui open source",
    "pixa-ui components library",
    "pixa-ui components collection",
    "pixa-ui components design",
    "pixa-ui components design system",
    "pixa-ui components design library",
    "pixa-ui components design system library",
    "pixa-ui components design system collection",
    "pixa-ui components design system open source",
    "pixa-ui components design system nextjs",
    "nextjs ui components",
    "nextjs components",
    "nextjs ui library",
    "nextjs open source",
    "nextjs components library",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Pixa/ui",
    description: "Pixa/ui - Curated collection of versatile Next.js components",
    url: "https://pixaui.com",
    images: [
      {
        url: "/openGraph.png",
      },
    ],
  },
  twitter: {
    title: "Pixa/ui",
    description: "Pixa/ui - Curated collection of versatile Next.js components",
    card: "summary_large_image",
    images: ["/openGraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${hostGrotesk.variable} ${geistMono.variable} font-sans antialiased noise-overlay min-h-svh`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
