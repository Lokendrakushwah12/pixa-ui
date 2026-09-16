import "./globals.css";

import { SoundEffects } from "@pixa/ui/components/fluid/sound";
import { fontHeading, fontMono, fontSans } from "@pixa/ui/fonts";
import { SiteFooter } from "@pixa/ui/shared/site-footer";
import { SiteHeader } from "@pixa/ui/shared/site-header";
import { ThemeProvider } from "@pixa/ui/shared/theme-provider";
import type { Metadata } from "next";

import { InlineScript } from "@/components/inline-script";
import { Preferences } from "@/components/preferences";

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
        {/* Saved preferences, applied before paint for the same reason the
            theme is: otherwise a custom radius or accent flashes the default
            first. The selectors must outrank next/font's body class and the
            .dark block — see cssFor() in components/preferences. */}
        <InlineScript
          html={`(function(){try{var p=JSON.parse(localStorage.getItem('pixa:prefs')||'{}');var r=[];if(p.font)r.push('html body[class]{--font-sans:'+p.font+'}');var t=[];if(p.radius&&p.radius!=='0.375rem')t.push('--radius:'+p.radius);if(p.accent){t.push('--primary:var(--color-'+p.accent+'-600)');t.push('--primary-foreground:var(--color-white)')}if(t.length)r.push(':root,:root.dark{'+t.join(';')+'}');if(r.length){var s=document.createElement('style');s.id='pixa-prefs';s.textContent=r.join('');document.head.appendChild(s)}}catch(e){}})()`}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} relative bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          {/* Off unless the reader turns it on in Preferences; the provider
              only wires listeners once enabled. */}
          <SoundEffects>
            <div className="relative isolate flex min-h-svh flex-col overflow-clip [--header-height:4rem]">
              <SiteHeader>
                <Preferences />
              </SiteHeader>
              {children}
              <SiteFooter />
            </div>
          </SoundEffects>
        </ThemeProvider>
      </body>
    </html>
  );
}
