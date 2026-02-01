import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Inter({
  axes: ["opsz"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const fontHeading = localFont({
  display: "swap",
  src: "./PPMondwest-Regular.woff2",
  variable: "--font-heading",
  weight: "600",
});
