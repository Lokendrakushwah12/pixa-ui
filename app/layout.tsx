import type { Metadata } from "next";
import { UncutSans } from "./fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

export const metadata: Metadata = {
  title: "Pixa UI",
  description:
    "A Collection of Open Source Components for React + TailwindCSS for your Project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${UncutSans.className} antialiased`}>
        {" "}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
