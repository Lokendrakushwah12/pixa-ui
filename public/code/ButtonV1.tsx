import React, { ReactNode } from "react";

interface ButtonV1Props {
  title?: string;
  svgColor?: string;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ButtonV1: React.FC<ButtonV1Props> = ({
  title = "ButtonV1",
  svgColor = "#212121",
  icon,
  className = "",
  style,
}) => {
  return (
    <div
      className={`group relative flex w-fit cursor-pointer items-center justify-center overflow-hidden border bg-[#ffffff01] p-2 pl-0 transition-all duration-500 hover:pl-2 hover:pr-0 ${className}`}
      style={style}
    >
      {icon ? (
        <div className="-translate-x-[150%] p-1 transition-all duration-300 group-hover:translate-x-[0%]">
          {icon}
        </div>
      ) : (
        <svg
          className="-translate-x-[150%] p-1 transition-all duration-300 group-hover:translate-x-[0%]"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.42999 4L15.5 10.07L9.42999 16.14"
            stroke={svgColor}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M4 10.0699L15 10.0699"
            stroke={svgColor}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <h3 className="z-20 -translate-x-[20%] font-[500] transition-all duration-300 group-hover:translate-x-[20%]">
        {title}
      </h3>
      {icon ? (
        <div className="translate-x-[0%] p-1 transition-all duration-300 group-hover:translate-x-[150%]">
          {icon}
        </div>
      ) : (
        <svg
          className="translate-x-[0%] p-1 transition-all duration-300 group-hover:translate-x-[150%]"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.42999 4L15.5 10.07L9.42999 16.14"
            stroke={svgColor}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M4 10.0699L15 10.0699"
            stroke={svgColor}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default ButtonV1;
