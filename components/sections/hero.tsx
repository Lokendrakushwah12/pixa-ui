import Link from "next/link";
import { SiNextdotjs, SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { PixaLogo, SiShadcnIcon } from "../icons";
import { Button } from "../ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Hero = () => {

  const ICONS = [
    { name: "Next.js", icon: SiNextdotjs },
    { name: "React.js", icon: SiReact },
    { name: "Tailwind CSS", icon: SiTailwindcss },
    { name: "TypeScript", icon: SiTypescript },
    { name: "shadcn/ui", icon: SiShadcnIcon },
  ]

  return (
    <div className="h-full p-4 w-full mx-auto space-y-4 py-8 md:py-16">
      <div className="flex w-full flex-col items-center max-w-5xl mx-auto justify-center gap-4">
        <PixaLogo className="h-24 w-24" />
        <h1 className="sm:text-balance text-center font-semibold text-3xl xl:text-4xl 2xl:text-5xl">
          Build faster with beautifully crafted components
        </h1>
        <p className="sm:text-balance text-center text-muted-foreground xl:text-lg 2xl:text-xl">
          Pixa UI is a composable and accessible collection of open-source Next.js components built with shadcn/ui and Tailwind CSS.
        </p>
        <div className="flex gap-2">
          <Button variant="default" asChild className="w-40">
            <Link href="/" className="flex items-center justify-center gap-3">
              Browse Components
            </Link>
          </Button>
          <Button variant="secondary" asChild className="w-40">
            <Link href="https://github.com/lokendrakushwah12/pixa-ui" target="_blank" className="flex items-center justify-center gap-3">
              Star on GitHub
            </Link>
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-4 text-muted-foreground">
          <p className="text-muted-foreground text-sm">Built with</p>
          {ICONS.map((icon) => (
            <Tooltip key={icon.name}>
              <TooltipTrigger asChild>
                <icon.icon size={20} />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
              >
                {icon.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;