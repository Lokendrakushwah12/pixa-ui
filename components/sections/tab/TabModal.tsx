"use client";
import { useCallback, useEffect, useState } from "react";
import Card from "../ui/Card";
import { CardDataType } from "@/types/types";
import ComponentActions from "../pixa-ui/ComponentActions";

const cardData: CardDataType[] = [
  {
    title: "ResetDialog",
    href: "/modals/1",
    component: <></>,
  },
];

const TabModal = () => {
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
            src={`/assets/images/${data.title}.png`}
          >
            {/* Check if 'data.component' is truthy, not null */}
            {/* {data.component && (
              <Image
                src={`/assets/images/${data.title}.png`}
                width={600}
                height={300}
                alt={data.title}
                className="h-full object-cover"
              />
            )} */}
          </Card>
        </div>
      ))}
    </>
  );
};

export default TabModal;
