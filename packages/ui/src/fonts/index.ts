import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  axes: ["opsz"],
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const fontHeading = localFont({
  display: "swap",
  src: "./PPMondwest-Regular.woff2",
  variable: "--font-heading",
  weight: "600",
});