import userData from "@/data/siteData";
import Link from "next/link";
import { PixaLogo } from "../icons";
import { ThemeToggle } from "../theme-toggle";
import { GitHubButton } from "../ui/github-button";

// const spring = {
//     type: 'spring',
//     stiffness: 260,
//     damping: 25,
//     delay: 0.125,
// };
const Header = () => {
    const { name } = userData.personalInfo;

    return (
        <div className="sticky top-0 py-4 max-w-screen-xl w-full mx-auto 2xl:px-0 px-4">
            <div className="flex items-center gap-4 justify-between h-8">
                <Link href="/" className="flex items-center gap-2 -ml-2 justify-center">
                    <div className="flex items-center justify-center font-medium tracking-tight text-sm">
                        <PixaLogo />
                        <span className="text-base">{name}</span>
                    </div>
                </Link>
                <div className="flex items-center gap-1">
                    <GitHubButton />
                    <div className="hidden md:block h-5 w-[1px] bg-border" />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default Header;