import { Geist_Mono, Host_Grotesk } from "next/font/google";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
});

export { geistMono, hostGrotesk };
