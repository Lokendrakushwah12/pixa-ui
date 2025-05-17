import userData from "@/data/siteData";
import * as motion from "motion/react-client";
import Link from "next/link";
import { GithubIcon, XIcon } from "../icons";
import { Button } from "../ui/Button";

const spring = {
    type: 'spring',
    stiffness: 260,
    damping: 25,
};
const Header = () => {
    const { name, github, twitter } = userData.personalInfo;

    return (
        <div className="sticky top-0 z-50">
            <div className="p-4 max-w-screen-xl w-full mx-auto">
                <div className="flex items-center gap-4 justify-between h-8">
                    <Link href="/" className="flex items-center gap-2 justify-center">
                        <div className="flex flex-col items-start justify-start font-medium tracking-tight text-sm">
                            <span className="text-base">{name}</span>
                        </div>
                    </Link>
                    <div className="flex items-center">
                        <motion.div
                            initial={{ width: 36 }}
                            whileHover={{ width: 200 }}
                            transition={spring}
                            className="overflow-hidden"
                        >
                            <Button variant="ghost" size="lg" asChild className="w-full h-9 group">
                                <Link href={twitter} target="_blank" className="flex items-center justify-start gap-3">
                                    <XIcon className="size-4 -ml-1.5" />
                                    <span className="whitespace-nowrap">Follow for updates</span>
                                </Link>
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ width: 36 }}
                            whileHover={{ width: 100 }}
                            transition={spring}
                            className="overflow-hidden"
                        >
                            <Button variant="ghost" size="lg" asChild className="w-full h-9 group">
                                <Link href={github} target="_blank" className="flex items-center justify-start gap-3">
                                    <GithubIcon className="size-4 -ml-1.5" />
                                    <span className="whitespace-nowrap">GitHub</span>
                                </Link>
                            </Button>
                        </motion.div>
                        {/* <ThemeToggle /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;