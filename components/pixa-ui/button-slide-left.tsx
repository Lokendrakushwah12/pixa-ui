"use client";
import React, { useState, CSSProperties } from "react";

interface ButtonSlideLeftProps {
  title: string;
  borderRadius?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const ButtonSlideLeft: React.FC<ButtonSlideLeftProps> = ({
  title,
  borderRadius = "8px",
  color = "#212121",
  className = "",
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border p-2 pr-0 transition-all duration-300 hover:pl-0 hover:pr-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? color : "transparent",
        borderRadius,
        ...style,
      }}
    >
      <svg
        style={{ backgroundColor: color }}
        className="h-6 w-6 translate-x-[0%] rotate-90 rounded-full p-1 transition-all group-hover:-translate-x-[150%]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.42999 4L15.5 10.07L9.42999 16.14"
          stroke="#fff"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M4 10.0699L15 10.0699"
          stroke="#fff"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
      <h3
        // style={{ color: isHovered ? "#ffffff" : "#000000" }}
        className="z-20 translate-x-[20%] transition-all group-hover:-translate-x-[20%]"
      >
        {title}
      </h3>
      <svg
        className="h-6 w-6 translate-x-[150%] rotate-90 rounded-full bg-[#fff] p-1 transition-all group-hover:translate-x-[0%]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.42999 4L15.5 10.07L9.42999 16.14"
          stroke="#212121"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M4 10.0699L15 10.0699"
          stroke="#212121"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ButtonSlideLeft;
