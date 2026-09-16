import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@pixa/ui/shared/page-header";
import type { Metadata } from "next";

import { BackToHomeButton } from "@/components/back-to-home-button";

export const metadata: Metadata = {
  description:
    "The page you're looking for doesn't exist or may have been moved.",
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container mb-16 flex w-full flex-1 items-center justify-center lg:mb-20">
      <PageHeader>
        <PageHeaderHeading className="select-none text-9xl! text-muted-foreground/30">
          404
        </PageHeaderHeading>
        <PageHeaderDescription className="select-none">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </PageHeaderDescription>
        <div className="mt-4">
          <BackToHomeButton />
        </div>
      </PageHeader>
    </div>
  );
}
