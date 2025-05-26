"use client";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    title: "Spinner",
    href: "/spinner/1",
    component: (
      <></>
    ),
  },
  {
    title: "Loader",
    href: "/loader/2",
    component: (
      <></>
    ),
  },
  {
    title: "Magnetic",
    href: "/magnetic/3",
    component: (
      <></>
    ),
  },
];

const TabExtraContent = () => {

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

export default TabExtraContent;
