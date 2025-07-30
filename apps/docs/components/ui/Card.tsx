import { useRouter } from "next/navigation";
import React from "react";

const Card = ({
  title,
  href,
  children,
}: {
  title: React.ReactNode;
  href: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <div
        onClick={handleClick}

        className="flex w-full min-h-[245px] h-full backdrop-blur-lg cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-[radial-gradient(#40404030_1px,#fff7_0)] dark:bg-[radial-gradient(#aaa3_1px,#1111_0)] dark:hover:bg-[radial-gradient(#aaa3_1px,#1114_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] duration-300 border-border hover:border-muted-foreground/25 transition-all dark:shadow-[inset_0_0_0_1px_#0a0a0a]"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      <h1 onClick={handleClick} className="flex w-full cursor-pointer text-muted-foreground hover:text-foreground items-center justify-between px-2">
        {title}
      </h1>
    </div>
  );
};

export default Card;
