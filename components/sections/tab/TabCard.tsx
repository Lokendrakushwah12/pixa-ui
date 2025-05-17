"use client";
import ComponentActions from "@/components/pixa-ui/ComponentActions";
import Card from "@/components/ui/Card";
import { CardDataType } from "@/types/types";
import { useCallback, useEffect, useMemo, useState } from "react";

const TabCard = () => {
  const [codes, setCodes] = useState<{ [key: string]: string }>({});

  const cardData = useMemo<CardDataType[]>(() => [
    {
      title: "StackCard",
      href: "/card/1",
      component: <></>,
    },
  ], []);


  const fetchCode = useCallback(async (componentName: string) => {
    setCodes((prevCodes) => {
      if (prevCodes[componentName]) return prevCodes;

      fetch(`/code/${componentName}.tsx`)
        .then((res) => res.ok ? res.text() : null)
        .then((data) => {
          if (data) {
            setCodes((prev) => ({ ...prev, [componentName]: data }));
          }
        });

      return prevCodes;
    });
  }, []);


  useEffect(() => {
    cardData.forEach((data) => {
      fetchCode(data.title);
    });
  }, [cardData, fetchCode]);

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
            {data.component}
          </Card>
        </div>
      ))}
    </>
  );
};

export default TabCard;
