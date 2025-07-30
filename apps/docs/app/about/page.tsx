import { XIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import PixaBackground from "@/components/ui/pixa-background";
import siteData from "@/data/siteData";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const page = () => {
  const { twitter, github, linkedin } = siteData.personalInfo;
  return (
    <div className="flex h-screen overflow-hidden relative w-full flex-col items-center justify-start gap-12 text-center">
      <PixaBackground />
      <div className="flex w-full max-w-3xl flex-col items-start justify-start px-5 md:px-8">
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
            <div className="social flex gap-1 items-center">
              <Button variant="ghost" asChild className="size-8 group">
                <Link href={twitter} target="_blank" className="flex items-center justify-center gap-3">
                  <XIcon className="size-4" />
                </Link>
              </Button>
              <div className="hidden md:block h-5 w-[1px] bg-border" />
              <Button variant="ghost" asChild className="size-8 group">
                <Link href={github} target="_blank" className="flex items-center justify-center gap-3">
                  <GitHubLogoIcon />
                </Link>
              </Button>
              <div className="hidden md:block h-5 w-[1px] bg-border" />
              <Button variant="ghost" asChild className="size-8 group">
                <Link href={linkedin} target="_blank" className="flex items-center justify-center gap-3">
                  <LinkedInLogoIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default page;
