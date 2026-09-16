"use client";

import { cn } from "../../lib/utils";
import { AspectRatio } from "../../components/fluid/aspect-ratio";
import { Skeleton } from "../../components/fluid/skeleton";
import { Spinner } from "../../components/fluid/spinner";
import { Progress } from "../../components/fluid/progress";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";

type GenerationState = "queued" | "generating" | "done" | "failed";

interface ImageGenerationProps {
  state: GenerationState;
  src?: string;
  alt?: string;
  prompt?: string;
  progress?: number;
  error?: string;
  ratio?: number;
  className?: string;
}

function ImageGeneration({
  state,
  src,
  alt,
  prompt,
  progress,
  error,
  ratio = 1,
  className,
}: ImageGenerationProps) {
  const shape = useShape();
  const XIcon = useIcon("x");

  return (
    <figure data-slot="image-generation" className={cn("flex w-full flex-col gap-2", className)}>
      <div className={cn("overflow-hidden border border-border", shape.container)}>
        <AspectRatio ratio={ratio}>
          {state === "done" && src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? prompt ?? ""}
              className="size-full object-cover"
            />
          ) : state === "failed" ? (
            <div
              role="alert"
              className="flex size-full flex-col items-center justify-center gap-2 bg-destructive/5 p-4 text-center"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-destructive/15 text-destructive [&>svg]:size-4">
                <XIcon />
              </span>
              <p className="text-[12px] text-destructive">
                {error ?? "Generation failed"}
              </p>
            </div>
          ) : (
            <div className="relative size-full">
              <Skeleton className="size-full rounded-none" />
              <div
                role="status"
                aria-live="polite"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6"
              >
                <Spinner label={null} />
                <span className="text-[12px] text-muted-foreground">
                  {state === "queued" ? "Queued" : "Generating…"}
                </span>
                {state === "generating" && (
                  <div className="w-full max-w-40">
                    <Progress value={progress ?? null} />
                  </div>
                )}
              </div>
            </div>
          )}
        </AspectRatio>
      </div>

      {prompt && (
        <figcaption className="text-[12px] text-muted-foreground">{prompt}</figcaption>
      )}
    </figure>
  );
}

export { ImageGeneration };
export type { ImageGenerationProps, GenerationState };
