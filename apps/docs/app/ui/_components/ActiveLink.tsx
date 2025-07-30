// components/ActiveLink.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ActiveLink({ href, children, className }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm p-1 rounded font-[460] leading-none outline-none focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800",
        isActive
          ? "text-foreground"
          : "duration-200 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}