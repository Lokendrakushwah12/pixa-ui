import { PageHeader, PageHeaderHeading } from "@pixa/ui/shared/page-header";
import { SiteCta } from "@pixa/ui/shared/site-cta";

export default async function Page() {
  return (
    <main className="container mt-8 mb-16 w-full flex-1 lg:mb-20">
      <PageHeader>
        <PageHeaderHeading className="max-w-3xl text-7xl!">
          Build faster with beautifully crafted components
        </PageHeaderHeading>
      </PageHeader>
      <SiteCta />
    </main>
  );
}
