import React, { useState } from "react";

const ButtonV2 = ({
  title,
  color,
  borderRadius,
  background,
  border,
  textColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const bgColor = color ? color : "#212121";
  const borderColor = `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(
    bgColor.slice(3, 5),
    16,
  )}, ${parseInt(bgColor.slice(5, 7), 16)}, 0.15)`;
  const txtColor = textColor ? textColor : "#212121";
  const brRadius = borderRadius ? borderRadius : "8px";
  const textifbgisfalse = background != false ? "#fff" : "212121";

  return (
    <div
      className="group relative z-0 flex h-9 cursor-pointer flex-col items-center overflow-hidden rounded-[999px] border p-2"
      style={{
        borderRadius: brRadius,
        border: border == false ? "none" : `1px solid ${borderColor}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{ backgroundColor: bgColor }}
        className="absolute -bottom-3/4 left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-3 rounded-full transition-all duration-500 group-hover:h-[180%] group-hover:w-[120%]"
      ></div>
      <h3
        style={{ color: isHovered ? "#ffffff" : txtColor }}
        className="z-20 translate-y-[0%] rounded-[7px] text-[16px] font-[500] leading-[19px] transition-all duration-300 group-hover:-translate-y-[150%]"
      >
        {title}
      </h3>
      <h3
        style={{ color: isHovered ? textifbgisfalse : txtColor }}
        className="z-20 translate-y-[50%] rounded-[7px] text-[16px] font-[500] leading-[19px] transition-all duration-300 group-hover:-translate-y-[100%]"
      >
        {title}
      </h3>
    </div>
  );
};

export default ButtonV2;
