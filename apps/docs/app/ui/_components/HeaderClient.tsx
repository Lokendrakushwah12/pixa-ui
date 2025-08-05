// components/HeaderClient.tsx
"use client";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface HeaderClientProps {
  children: ReactNode;
}

export function HeaderClient({ children }: HeaderClientProps) {
  const pathname = usePathname();
  const isDocsPage = pathname.startsWith("/ui");

  function handleScroll() {
    // Scroll handling logic can be added here if needed
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "top-0 z-50 h-16 w-full transition-colors duration-300 ease-out border-transparent",
        isDocsPage ? "sticky" : "fixed"
      )}
    >
      <ProgressiveBlur direction="top" blurIntensity={0.5} className="absolute z-[-10] top-0 w-full h-20" />
      {children}
    </header>
  );
}