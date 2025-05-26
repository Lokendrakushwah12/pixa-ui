"use client";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    title: "Dialog",
    href: "/dialogs/1",
    component: (
      <></>
    ),
  },
  {
    title: "Dialog",
    href: "/dialogs/2",
    component: (
      <></>
    ),
  },
  {
    title: "Dialog",
    href: "/dialogs/3",
    component: (
      <></>
    ),
  },
  {
    title: "Dialog",
    href: "/dialogs/4",
    component: (
      <></>
    ),
  },
  {
    title: "Dialog",
    href: "/dialogs/5",
    component: (
      <></>
    ),
  },
];

const TabDialogContent = () => {

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

export default TabDialogContent;
