import { PixaLogo } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import GitHubButton from "@/components/ui/github-button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { ActiveLink } from "./ActiveLink";
import { CommandMenu } from "./cmdk";
import Drawer from "./Drawer";
import { HeaderClient } from "./HeaderClient";

const ITEMS = [
  {
    name: "Docs",
    slug: "/docs",
  },
  {
    name: "Components",
    slug: "/ui/accordion",
  },
];

export function Header() {
  return (
    <HeaderClient>
      <nav className="flex w-full h-full items-center justify-between bg-gradient-to-b from-background to-background/0 gap-6 px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 -ml-2 lg:mr-[205px] justify-center pe12">
          <div className="flex items-center justify-center font-medium tracking-tight text-sm">
            <PixaLogo />
            <span className="text-base">Pixa/ui</span>
          </div>
        </Link>
        <CommandMenu />
        <div className="hidden items-center gap-5 lg:flex">
          <div className="flex items-center gap-5">
            {ITEMS.map(({ name, slug }) => (
              <ActiveLink key={name} href={slug}>
                {name}
              </ActiveLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <GitHubButton />
            <div aria-hidden className="h-[21px] w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
        <div className="block lg:hidden">
          <Drawer>
            <button className="flex items-center w-fit [@media(min-width:390px)]:ml-[56px] justify-end lg:hidden">
              <MenuIcon
                size={24}
                className="stroke-1 text-neutral-600 dark:text-neutral-400"
              />
            </button>
          </Drawer>
        </div>
      </nav>
    </HeaderClient>
  );
}