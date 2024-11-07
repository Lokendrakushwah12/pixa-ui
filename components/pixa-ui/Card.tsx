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
    <div className="flex flex-col items-center justify-center gap-2">
      <Link
        href={href}
        className="flex aspect-[1/1] h-[156px] w-[156px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-transform duration-300 hover:scale-[103%] hover:border-[var(--border-hover)] dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[200px] md:w-[200px]"
      >
        {src && (
          <Image
            src={src}
            alt="Card"
            width={200}
            height={200}
            draggable={false}
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
