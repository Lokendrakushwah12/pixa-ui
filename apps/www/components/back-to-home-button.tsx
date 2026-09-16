"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@pixa/ui/components/button";
import Link from "next/link";

// Client component so HugeiconsIcon lives in the client bundle. Rendering it
// inside base-ui Button's render prop from a Server Component leaves it
// undefined on the client.
export function BackToHomeButton() {
  return (
    <Button
      className="group"
      render={
        <Link href="/">
          <HugeiconsIcon
            className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
            data-slot="accordion-trigger-icon"
            icon={ArrowLeft01Icon}
            strokeWidth={2}
          />
          Back to Home
        </Link>
      }
      size="lg"
    />
  );
}
