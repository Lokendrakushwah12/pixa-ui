import { Skeleton } from "@pixa/ui/components/skeleton";
import { GitHubLinkButton } from "@pixa/ui/shared/github-link-button";
import * as React from "react";

export function GitHubLink() {
  return (
    <GitHubLinkButton>
      <React.Suspense fallback={<Skeleton className="h-4 w-[25.5px]" />}>
        <StarsCount />
      </React.Suspense>
    </GitHubLinkButton>
  );
}

export async function StarsCount() {
  try {
    const data = await fetch(
      "https://api.github.com/repos/lokendrakushwah12/pixa-ui",
      {
        next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
      },
    );

    if (!data.ok) {
      throw new Error(`GitHub API error: ${data.status}`);
    }

    const json = await data.json();
    const starsCount = json.stargazers_count;

    if (typeof starsCount !== "number" || starsCount < 0) {
      throw new Error("Invalid stars count");
    }

    return (
      <span className="w-8 text-muted-foreground text-xs tabular-nums">
        {starsCount >= 1000
          ? `${(starsCount / 1000).toFixed(1)}k`
          : starsCount.toLocaleString()}
      </span>
    );
  } catch {
    // Return nothing when GitHub API is unavailable or repo doesn't exist
    return null;
  }
}
