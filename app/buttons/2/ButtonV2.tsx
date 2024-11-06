import React from "react";

interface ButtonV2Props {
  title: string;
  bgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ButtonV2: React.FC<ButtonV2Props> = ({
  title,
  bgColor = "#f0900f",
  className = "",
  style,
}) => {
  return (
    <div
      className={`group relative z-0 flex h-9 w-fit cursor-pointer items-center overflow-hidden rounded-full p-2 ${className}`}
      style={{ ...style }}
    >
      <div
        className="absolute -bottom-3/4 left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-3 rounded-full transition-all duration-300 group-hover:h-[180%] group-hover:w-[120%]"
        style={{ backgroundColor: bgColor }}
      ></div>

      <h3 className="z-20 translate-y-0 transition-all duration-300 group-hover:-translate-y-[200%]">
        {title}
      </h3>
      <h3 className="absolute left-1/2 z-20 -translate-x-1/2 translate-y-[200%] transition-all duration-300 group-hover:-translate-y-0">
        {title}
      </h3>
    </div>
  );
};

export default ButtonV2;
