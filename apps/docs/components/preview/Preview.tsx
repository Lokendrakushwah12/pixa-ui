"use client";

import { CodeBlock } from "@/app/ui/_components/CodeBlock";
import { CopyCode } from "@/app/ui/_components/CopyCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/_components/Tabs";
import { cn } from "@/lib/utils";
import { BoxIcon, CodeIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

type PreviewProps = {
  path: string;
  height?: string;
  className?: string;
  showSource?: boolean;
  type?: 'component' | 'block';
};

export function Preview({
  path,
  height = "h-[350px]",
  className,
  showSource = true,
  type = 'component',
}: PreviewProps) {
  const [code, setCode] = useState<string>("");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadComponent() {
      try {
        setLoading(true);

        // Fetch the example code
        const response = await fetch(`/api/examples/${path}`);
        if (!response.ok) {
          throw new Error(`Failed to load example: ${response.statusText}`);
        }

        const exampleCode = await response.text();
        setCode(exampleCode);

        // Parse the code to replace import paths
        const parsedCode = exampleCode
          .replace(/@\/app\/_components\/ui\//g, '@/components/ui/')
          .replace(/@\/components\/ui\//g, '@/components/ui/');

        setSourceCode(parsedCode.replace(/@\/components\/ui\//g, '@/source/ui/'));

        // Dynamically import the component
        const componentModule = await import(`@/examples/${path}.tsx`);
        setComponent(() => componentModule.default);

      } catch (err) {
        console.error(`Error loading component for ${path}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load component');
      } finally {
        setLoading(false);
      }
    }

    loadComponent();
  }, [path]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", height)}>
        <div className="text-sm text-muted-foreground">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center", height)}>
        <div className="text-sm text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative size-full overflow-hidden rounded-2xl border bg-muted dark:bg-background p-1",
      type === 'block' && 'h-[48rem] prose-code:border-none prose-code:p-0',
      type === 'component' && 'not-prose',
      className
    )}>
      <Button variant="secondary" size="sm" className="absolute p-0 size-7 right-2 top-14 z-[9999999]">
        <CopyCode
          code={sourceCode || ""}
        />
      </Button>
      <Tabs className="h-full gap-0" defaultValue="preview">
        <TabsList className="w-full rounded-none pr-3">
          <TabsTrigger value="preview">
            <EyeIcon className="text-neutral-500 group-data-[state=active]:text-primary group-hover:text-muted-foreground mr-2" size={16} />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <CodeIcon className="text-neutral-500 group-data-[state=active]:text-primary group-hover:text-muted-foreground mr-2" size={16} />
            Code
          </TabsTrigger>
          {showSource && (
            <TabsTrigger value="source">
              <BoxIcon className="text-neutral-500 group-data-[state=active]:text-primary group-hover:text-muted-foreground mr-2" size={16} />
              Source
            </TabsTrigger>
          )}
        </TabsList>

        {showSource && (
          <TabsContent
            className="not-prose size-full mt-px overflow-y-auto p-0 bg-transparent"
            value="source"
          >
            <CodeBlock className={height} contentClassName="h-full" simpleCode={sourceCode}>
              {sourceCode}
            </CodeBlock>
          </TabsContent>
        )}

        <TabsContent
          className="not-prose size-full mt-px overflow-y-auto p-0 bg-transparent"
          value="code"
        >
          <CodeBlock className={height} contentClassName="h-full" simpleCode={code}>
            {code}
          </CodeBlock>
        </TabsContent>

        <TabsContent
          className={cn(
            "not-prose size-full mt-px overflow-y-auto p-0 bg-transparent",
            type === 'component' ? 'overflow-hidden' : 'overflow-auto'
          )}
          value="preview"
        >
          {type === 'block' ? (
            Component && <Component />
          ) : (
            <PreviewRender>
              {Component && <Component />}
            </PreviewRender>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// PreviewRender component for wrapping the preview
function PreviewRender({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-[350px] bg-white dark:bg-black rounded-xl p-0">
      {children}
    </div>
  );
} 