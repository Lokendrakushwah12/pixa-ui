import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

const Nav = () => {
  return (
    <>
      <div className="z-50 flex h-[60px] w-full items-center justify-between border-b border-[#d2d9d9] py-4 dark:border-[#212121] sm:px-12 lg:px-24">
        <div className="ml-4 flex items-center gap-4">
          <Link href="/">
            <h1 className="cursor-pointer text-[20px] font-[600] transition-all hover:text-[#fefefe]">
              Pixa UI
            </h1>
          </Link>
        </div>
        <div className="mr-4 flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="https://github.com/Lokendrakushwah12/pixa-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-[4px] p-1 text-[14px] font-[500] transition-all hover:text-[#fefefe]"
          >
            GitHub
          </Link>
          <Link
            href="/about"
            className="cursor-pointer rounded-[4px] p-1 text-[14px] font-[500] transition-all hover:text-[#fefefe]"
          >
            About
          </Link>
        </div>
      </div>
    </>
  );
};

export default Nav;
