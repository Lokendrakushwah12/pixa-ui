"use client";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@pixa/ui/components/button";
import { siteConfig } from "@pixa/ui/lib/config";
import Link from "next/link";
import type * as React from "react";

// Client component so HugeiconsIcon + base-ui Button live in the client bundle.
// The star count is passed in as children (an already-rendered server node),
// which keeps StarsCount server-side for build-time fetching.
export function GitHubLinkButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      className="relative h-8 shadow-none max-sm:w-8"
      render={
        <Link href={siteConfig.links.github} rel="noreferrer" target="_blank">
          <HugeiconsIcon className="size-4" icon={GithubIcon} strokeWidth={2} />
          <span className="max-sm:sr-only">{children}</span>
        </Link>
      }
      size="sm"
      variant="ghost"
    />
  );
}
