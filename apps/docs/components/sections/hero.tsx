"use client";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SiNextdotjs, SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { PixaLogo, SiShadcnIcon } from "../icons";
import { Button } from "../ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ResponsiveDialog } from "./dia";

const Hero = () => {

  const ICONS = [
    { name: "Next.js", icon: SiNextdotjs },
    { name: "React.js", icon: SiReact },
    { name: "Tailwind CSS", icon: SiTailwindcss },
    { name: "TypeScript", icon: SiTypescript },
    { name: "shadcn/ui", icon: SiShadcnIcon },
  ]
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = async () => {
    setIsLoading(true);
    try {
      console.log('Cancelling subscription...');
      setOpen(false);
    } catch (error) {
      console.error('Cancellation failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (value: boolean) => {
    setOpen(value);
  };

  return (
    <div className="h-full p-4 w-full mx-auto space-y-4 pb-8 pt-16 md:py-16">
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
            <Link href="/ui/button-ai" className="flex items-center justify-center gap-3">
              Browse Components
            </Link>
          </Button>
          <Button variant="secondary" asChild className="w-40">
            <Link href="https://github.com/lokendrakushwah12/pixa-ui" target="_blank" className="flex items-center justify-center gap-3">
              Star on GitHub
            </Link>
          </Button>
        </div>
        <ResponsiveDialog
          open={open}
          onOpenChange={onOpenChange}
          title="Cancel Subscription"
          trigger={<Button variant="destructive">Cancel Subscription</Button>}
        >
          <div className="space-y-3 text-muted-foreground text-sm">
            <p>Are you sure you want to cancel your subscription?</p>
            <p>
              If you cancel now, you'll lose access immediately. You can always start a new
              subscription later, but you won't get another free trial.
            </p>
          </div>
          <div className="flex flex-col-reverse md:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Subscription
            </Button>
          </div>
        </ResponsiveDialog>
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