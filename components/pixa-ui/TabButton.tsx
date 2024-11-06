import React from "react";
import Card from "./Card";
import ButtonV2 from "@/app/buttons/2/ButtonV2";
import { ButtonV1 } from "@pixaui/button-v1";
import ButtonV3 from "@/app/buttons/3/ButtonV3";
import { ButtonV4 } from "@pixaui/button-v4";
import { ButtonV5 } from "@pixaui/button-v5";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    title: "Button V1",
    href: "/buttons/1",
    component: (
      <ButtonV1
        title="ButtonV1"
        className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm dark:border-[#212121]"
      />
    ),
  },
  {
    title: "Button V2",
    href: "/buttons/2",
    component: (
      <ButtonV2
        title="ButtonV2"
        className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm dark:border-[#212121]"
      />
    ),
  },
  {
    title: "Button V3",
    href: "/buttons/3",
    component: (
      <ButtonV3
        title="ButtonV3"
        // className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm dark:border-[#212121]"
      />
    ),
  },
  {
    title: "Button V4",
    href: "/buttons/4",
    component: (
      <ButtonV4
        title="ButtonV4"
        // className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm dark:border-[#212121]"
      />
    ),
  },
  {
    title: "Button V5",
    href: "/buttons/5",
    component: (
      <ButtonV5
        title="ButtonV5"
        // className="overflow-hidden rounded-xl border border-[#d9d9d9] backdrop-blur-sm dark:border-[#212121]"
      />
    ),
  },
];

const TabButton = () => {
  return (
    <>
      {cardData.map((data) => (
        <div
          key={data.title}
          className="flex w-full flex-col items-start justify-center gap-4"
        >
          <Card title={data.title} href={data.href}>
            {data.component}
          </Card>
        </div>
      ))}
    </>
  );
};

export default TabButton;
