import Link from "next/link";
import { PixaLogo } from "../icons";
import { Button } from "../ui/Button";

const About = () => {

  return (
    <div className="h-full p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <PixaLogo className="h-24 w-24" />
        <h1 className="text-xl font-[500] text-foreground md:text-3xl">
          We&apos;re Launching Soon!
        </h1>
        <p className="text-base text-center font-[400] text-foreground/60 xs:text-sm md:text-lg">
          Curated collection of versatile Next.js components
        </p>
        <Link href="https://github.com/lokendrakushwah12/pixa-ui" target="_blank">
          <Button variant="default">Star on GitHub</Button>
        </Link>
      </div>
    </div>
  );
};

export default About;