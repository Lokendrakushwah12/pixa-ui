

import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger
} from "@/components/pixa-ui/animated-tabs";
import CodeBlock from "@/components/Table/CodeBlock";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getCategoryById, getComponentById } from "@/config/components";
import { notFound } from "next/navigation";

interface ComponentPageProps {
  params: Promise<{
    category: string;
    component: string;
  }>;
}

const ComponentPage = async ({ params }: ComponentPageProps) => {
  const { category, component } = await params;
  const categoryData = getCategoryById(category);
  const componentData = getComponentById(category, component);
  const Component = componentData?.component;

  if (!categoryData || !componentData) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryData.name, href: `/${category}` },
    { label: componentData.name },
  ];

  return (
    <div className="max-w-screen-lg mx-auto sm:px-0 px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <AnimatedTabs defaultValue="showcase" className="bg-muted-foreground/10 p-[6px] rounded-[14px]">
        <AnimatedTabsList>
          <AnimatedTabsTrigger value="showcase">Showcase</AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="code">Code</AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="source">Source</AnimatedTabsTrigger>
        </AnimatedTabsList>

        <AnimatedTabsContent value="showcase" className="flex h-[230px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-background border bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-all dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[330px] md:w-full">
          {Component && (
            <Component />
          )}
        </AnimatedTabsContent>

        <AnimatedTabsContent value="code">
          <CodeBlock
            value={componentData.code || ""}
            language="tsx"
            filename={`${componentData.name.replace(/\s+/g, '')}.tsx`}
          />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="source">
          <div>Source content</div>
        </AnimatedTabsContent>
      </AnimatedTabs>
    </div>
  );
};

export default ComponentPage;



