import { GithubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import Header from "@/components/sections/header";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const LINK = {
  TWITTER: "https://twitter.com/lokendratwt",
  GITHUB: "https://github.com/Lokendrakushwah12",
  LINKEDIN: "https://www.linkedin.com/in/lokendrakushwah12/",
};

const page = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between text-center">
      <Header />
      <div className="flex h-screen w-full max-w-3xl flex-col items-start justify-start px-5 md:px-8">
        <div className="flex flex-col items-start justify-start">
          <h1 className="mt-8 text-center text-[48px] font-[600] text-[var(--foreground)]">
            About
          </h1>
          <p className="text-left text-sm md:text-base text-muted-foreground">
            Pixa UI is a curated collection of versatile&nbsp;
            <Badge className="bg-pink-600/15 text-xs md:text-sm text-pink-500">Next.js</Badge>
            &nbsp;components
          </p>
          <br />
          <p className="text-left text-sm md:text-base text-muted-foreground">
            As a developer, I often find it challenging to locate unique,
            accessible components. Many are paid, or simply unavailable. With
            Pixa UI, I&apos;ve built a library of components that I can use
            freely, and now you can too!
          </p>
          <br />
          <p className="text-left text-sm md:text-base text-muted-foreground">
            Pixa UI is&nbsp;<Badge className="bg-blue-600/15 text-xs md:text-sm text-blue-500">open source</Badge>&nbsp;and available
            for everyone. Feel free to use it in your projects, and if you
            have unique components to share, contributions are welcome!
            Together, we can make this library more valuable for the
            community.
          </p>
          <br />
          <p className="text-left text-sm md:text-base text-muted-foreground">
            Have questions or suggestions? Feel free to reach out!
          </p>
          <div className="my-4 w-full border-b"></div>
          <div className="flex w-full justify-between">
            <h1 className="font-[400] text-[var(--text-hover)]">
              Lokendra Kushwah
            </h1>
            <div className="social flex gap-2">
              <Link href={LINK.TWITTER} target="_blank">
                <XIcon />
              </Link>

              <Link href={LINK.GITHUB} target="_blank">
                <GithubIcon />
              </Link>

              <Link href={LINK.LINKEDIN} target="_blank">
                <LinkedInIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default page;
