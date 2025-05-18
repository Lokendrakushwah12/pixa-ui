import Image from "next/image";
import Link from "next/link";
import React from "react";

const Card = ({
  title,
  src,
  href,
  children,
  download,
}: {
  title: React.ReactNode;
  src?: string;
  href: string;
  children?: React.ReactNode;
  download?: React.ReactNode;
}) => {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <Link
        href={href}
        className="flex w-full min-h-[245px] backdrop-blur-lg cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-[radial-gradient(#40404030_1px,#fff7_0)] dark:bg-[radial-gradient(#aaa3_1px,#1111_0)] dark:hover:bg-[radial-gradient(#aaa3_1px,#1114_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] duration-300 border-border hover:border-muted-foreground/25 transition-all dark:shadow-[inset_0_0_0_1px_#0a0a0a]"
      >
        {src && (
          <Image
            src={src}
            alt="Card"
            width={700}
            height={700}
            draggable={false}
            loading="lazy"
            className="h-full w-full scale-105 select-none object-cover"
          />
        )}
        {children}
      </Link>
      <div className="flex w-full items-center justify-between px-2">
        <h1 className="text-base font-[400] text-[#444] dark:text-[#808080]">
          {title}
        </h1>
        {download}
      </div>
    </div>
  );
};

export default Card;
