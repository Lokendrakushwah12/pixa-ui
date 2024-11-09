"use client";
import { CardDataType } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import Card from "../ui/Card";
import ComponentActions from "../pixa-ui/ComponentActions";

interface Collection {
  id: number;
  title: string;
  images: string[];
}

const collection: Collection = {
  id: 1,
  title: "Nature Collection",
  images: [
    "https://images.unsplash.com/photo-1675897974745-1e78e8690755",
    "https://images.unsplash.com/photo-1486718448742-163732cd1544",
    "https://images.unsplash.com/photo-1600669091588-8aaac09509ba",
    "https://images.unsplash.com/photo-1583100913639-b8a172d90b77",
    "https://images.unsplash.com/photo-1583100913828-aeff24cc04ae",
    "https://images.unsplash.com/photo-1583100913639-f3b195f86da2",
  ],
};

const TabCard = () => {
  const [codes, setCodes] = useState<{ [key: string]: string }>({});

  const cardData: CardDataType[] = [
    {
      title: "StackCard",
      href: "/card/1",

      component: <></>,
    },
  ];

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
