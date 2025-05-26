"use client";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    title: "Card",
    href: "/cards/1",
    component: (
      <></>
    ),
  },
  {
    title: "Card",
    href: "/cards/2",
    component: (
      <></>
    ),
  },
  {
    title: "Card",
    href: "/cards/3",
    component: (
      <></>
    ),
  },
  {
    title: "Card",
    href: "/cards/4",
    component: (
      <></>
    ),
  },
  {
    title: "Card",
    href: "/cards/5",
    component: (
      <></>
    ),
  },
];

const TabCardContent = () => {

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

export default TabCardContent;
