import { Button } from "@pixa/ui/components/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@pixa/ui/shared/page-header";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";

export const metadata: Metadata = {
  description:
    "The page you're looking for doesn't exist or may have been moved.",
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container mb-16 w-full flex-1 lg:mb-20 flex justify-center items-center">
      <PageHeader>
        <PageHeaderHeading className="text-9xl! text-muted-foreground/30 select-none">404</PageHeaderHeading>
        <PageHeaderDescription className="select-none">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </PageHeaderDescription>
        <div className="mt-4">
          <Button
            className="group"
            render={
              <Link href="/">
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-slot="accordion-trigger-icon" className="-ms-1 group-hover:-translate-x-0.5 opacity-60 transition-transform" />
                Back to Home
              </Link>
            }
            size="lg"
          />
        </div>
      </PageHeader>
    </div>
  );
}
