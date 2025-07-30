"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

import { usePackageManager } from "@/hooks/use-package-manager";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CopyCode } from "./CopyCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

type CommandBlockProps = {
  npmCommand: string;
  yarnCommand: string;
  pnpmCommand: string;
  bunCommand: string;
} & React.ComponentProps<"div">;

export function CommandBlock({
  npmCommand,
  yarnCommand,
  pnpmCommand,
  bunCommand,
  className,
}: CommandBlockProps) {
  const [packageManager, setPackageManager] = usePackageManager();

  const tabs = useMemo(() => {
    return {
      npm: npmCommand,
      pnpm: pnpmCommand,
      yarn: yarnCommand,
      bun: bunCommand,
    };
  }, [npmCommand, pnpmCommand, yarnCommand, bunCommand]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border",
        className,
      )}
    >
      <Tabs
        defaultValue="npm"
        value={packageManager}
        onValueChange={(value) => setPackageManager(value as PackageManager)}
        className="bg-muted dark:bg-background p-1"
      >
        <div className="flex items-center justify-between pr-2.5">
          <TabsList className="bg-transparent h-10 pl-4">
            {Object.entries(tabs).map(([key]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="cursor-pointer hover:text-primary"
                classNameIndicator="bottom-0"
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyCode code={tabs[packageManager]} />
        </div>
        <div className="relative rounded-lg bg-white dark:bg-black">
          <ScrollArea className="w-full" >
            {Object.entries(tabs).map(([key, value]) => (
              <TabsContent key={key} value={key}>
                <pre className="px-4 pb-4 min-w-max">
                  <code
                    className="relative font-mono text-sm leading-none !text-foreground"
                    data-language="bash"
                  >
                    {value}
                  </code>
                </pre>
              </TabsContent>
            ))}
            <ScrollBar className="h-1.5" orientation="horizontal" />
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}
