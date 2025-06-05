"use client";
import ButtonV1 from "@/components/pixa-ui/button-slide-right";
import ButtonV2 from "@/components/pixa-ui/button-slide-up";
import ButtonV3 from "@/components/pixa-ui/button-ai";
import ButtonV4 from "@/components/pixa-ui/button-slide-left";
import ButtonV5 from "@/components/pixa-ui/button-unflatten";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    title: "ButtonV1",
    href: "/buttons/1",

    component: (
      <ButtonV1
        title="ButtonV1"
        svgColor="var(--foreground)"
        className="overflow-hidden rounded-xl border border-[var(--border)] text-[var(--foreground)] backdrop-blur-sm"
      />
    ),
  },
  {
    title: "ButtonV2",
    href: "/buttons/2",

    component: (
      <ButtonV2
        title="ButtonV2"
        className="overflow-hidden rounded-xl border border-[var(--border)] p-4 py-5 text-[var(--foreground)] backdrop-blur-sm"
      />
    ),
  },
  {
    title: "ButtonV3",
    href: "/buttons/3",

    component: (
      <ButtonV3
        title="ButtonV3"
      // className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm dark:border-[#212121]"
      />
    ),
  },
  {
    title: "ButtonV4",
    href: "/buttons/4",

    component: (
      <ButtonV4
        title="ButtonV4"
        className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm hover:text-white dark:border-[#212121]"
      />
    ),
  },
  {
    title: "ButtonV5",
    href: "/buttons/5",

    component: (
      <ButtonV5
        title="ButtonV5"
        className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#191919] text-white backdrop-blur-sm"
      />
    ),
  },
];

const TabButtonContent = () => {

  return (
    <div className="grid w-full max-w-3xl mx-auto grid-cols-1 sm:px-0 px-4 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {cardData.map((data, index) => (
        <div
          key={index}
          className="flex size-full flex-col items-start justify-center gap-4"
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

export default TabButtonContent;
