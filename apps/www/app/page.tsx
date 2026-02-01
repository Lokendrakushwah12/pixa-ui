import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@pixa/ui/shared/page-header";
import { SiteCta } from "@pixa/ui/shared/site-cta";
import { EffectScene } from "@/components/effect-scene";

export default async function Page() {
  return (
    <main className="container mt-12 mb-16 w-full flex-1 md:mt-8 lg:mb-20">
      <PageHeader>
        <PageHeaderHeading className="max-w-3xl text-5xl! md:text-7xl!">
          Build faster with beautifully crafted components
        </PageHeaderHeading>
        <PageHeaderDescription className="max-w-3xl">
          Pixa UI is a composable and accessible collection of open-source
          Next.js components built with shadcn/ui and Tailwind CSS.
        </PageHeaderDescription>
        <EffectScene />
      </PageHeader>
      <SiteCta />
    </main>
  );
}
