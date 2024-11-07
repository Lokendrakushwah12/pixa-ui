"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import ButtonV2 from "@/app/buttons/2/ButtonV2";
import { ButtonV1 } from "@pixaui/button-v1";
import ButtonV3 from "@/app/buttons/3/ButtonV3";
import { CardDataType } from "@/types/types";
import ComponentActions from "./ComponentActions";
import ButtonV4 from "@/app/buttons/4/ButtonV4";
import ButtonV5 from "@/app/buttons/5/ButtonV5";

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

const TabButton = () => {
  const [codes, setCodes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCode = async (componentName: string) => {
      const res = await fetch(`/code/${componentName}`);
      if (res.ok) {
        const data = await res.json();
        setCodes((prevCodes) => ({ ...prevCodes, [componentName]: data.code }));
      }
    };

    cardData.forEach((data) => {
      fetchCode(data.title);
    });
  }, []);

  return (
    <>
      {cardData.map((data) => (
        <div
          key={data.title}
          className="flex w-full flex-col items-start justify-center gap-4"
        >
          <Card
            title={data.title}
            download={
              <ComponentActions
                code={codes[data.title] || ""}
                componentName={data.title}
              />
            }
            href={data.href}
          >
            {data.component}
          </Card>
        </div>
      ))}
    </>
  );
};

export default TabButton;
