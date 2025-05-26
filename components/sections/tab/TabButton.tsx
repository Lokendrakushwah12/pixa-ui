"use client";
import ButtonV1 from "@/app/buttons/1/ButtonV1";
import ButtonV2 from "@/app/buttons/2/ButtonV2";
import ButtonV3 from "@/app/buttons/3/ButtonV3";
import ButtonV4 from "@/app/buttons/4/ButtonV4";
import ButtonV5 from "@/app/buttons/5/ButtonV5";
import ComponentActions from "@/components/pixa-ui/ComponentActions";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

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

  const fetchCode = useCallback(
    async (componentName: string) => {
      if (codes[componentName]) return;

      const res = await fetch(`/code/${componentName}.tsx`);
      if (res.ok) {
        const data = await res.text();
        setCodes((prevCodes) => ({ ...prevCodes, [componentName]: data }));
      }
    },
    [codes],
  );

  useEffect(() => {
    cardData.forEach((data) => {
      fetchCode(data.title);
    });
  }, [fetchCode]);

  return (
    <>
      {cardData.map((data, index) => (
        <div
          key={index}
          className="flex size-full flex-col items-start justify-center gap-4"
        >
          <Card
            key={index}
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
