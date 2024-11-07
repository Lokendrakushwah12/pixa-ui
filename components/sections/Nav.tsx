"use client";
import Link from "next/link";
import { LinearBlur } from "progressive-blur";
import Image from "next/image";
import { useTheme } from "next-themes";
import { LINK } from "@/constants";
import { ThemeToggle } from "../theme/ThemeToggle";

const Nav = () => {
  const { theme } = useTheme();

  return (
    <>
      <div className="sm:px-12 lg:px-24 sticky top-0 z-50 flex h-[60px] w-full items-center justify-between py-4">
        <LinearBlur
          side="top"
          tint={theme === "light" ? "#fff9" : "#121212aa"}
          strength={16}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
          }}
        />
        <div className="ml-4 flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src={`/assets/svg/${theme === "light" ? "logo-dark" : "logo"}.svg`}
              alt="Pixa UI Logo"
              width={32}
              height={32}
              className="cursor-pointer"
            />
            <h1 className="cursor-pointer text-[20px] font-[500] transition-all hover:text-[var(--text-hover)]">
              Pixa UI
            </h1>
          </Link>
        </div>
        <div className="mr-4 flex items-center gap-4">
          <ThemeToggle />
          <Link
            href={LINK.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-[4px] p-1 text-[14px] font-[500] transition-all hover:text-[var(--text-hover)]"
          >
            GitHub
          </Link>
          <Link
            href="/about"
            className="cursor-pointer rounded-[4px] p-1 text-[14px] font-[500] transition-all hover:text-[var(--text-hover)]"
          >
            About
          </Link>
        </div>
      </div>
    </>
  );
};

export default Nav;
