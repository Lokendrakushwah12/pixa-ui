"use client";
import { AnimatedTabs } from "@/components/pixa-ui/animated-tabs";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    title: "Tab",
    href: "/tabs/1",
    component: (
      <AnimatedTabs defaultValue="tab1" className="w-[300px] rounded-2xl bg-muted-foreground/40 dark:bg-muted-foreground/10 p-1">
        <AnimatedTabs.List className="w-full bg-black p-1 rounded-xl">
          <AnimatedTabs.Trigger value="tab1" className="w-full text-center text-sm">Tab 1</AnimatedTabs.Trigger>
          <AnimatedTabs.Trigger value="tab2" className="w-full text-center text-sm">Tab 2</AnimatedTabs.Trigger>
        </AnimatedTabs.List>
        <AnimatedTabs.Content value="tab1">
          <p className="text-sm text-foreground/80 px-2">This is the content for Tab 1.</p>
        </AnimatedTabs.Content>
        <AnimatedTabs.Content value="tab2">
          <p className="text-sm text-foreground/80 px-2">This is the content for Tab 2.</p>
        </AnimatedTabs.Content>
      </AnimatedTabs>
    ),
  },
  {
    title: "Tab",
    href: "/tabs/2",
    component: (
      <></>
    ),
  },
  {
    title: "Tab",
    href: "/tabs/3",
    component: (
      <></>
    ),
  },
  {
    title: "Tab",
    href: "/tabs/4",
    component: (
      <></>
    ),
  },
  {
    title: "Tab",
    href: "/cards/5",
    component: (
      <></>
    ),
  },
];

const TabTabContent = () => {

  return (
    <div className="grid w-full max-w-3xl mx-auto grid-cols-1 sm:px-0 px-4 gap-4">
      {cardData.map((data, index) => (
        <div
          key={index}
          className="flex size-full flex-col items-start h-[400px] justify-center gap-4"
        >
          <Card
            key={index}
            title={data.title}
            href={data.href}
          >
            {data.component}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TabTabContent;
