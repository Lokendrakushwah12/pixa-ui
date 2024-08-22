import React, { useState } from "react";

const ButtonV6 = ({
  title,
  borderRadius,
  color,
  border,
  textColor,
  className,
}) => {
  const [hovered, setHovered] = useState(false);

  const txtColor = textColor ? textColor : "#212121";
  const brRadius = borderRadius ? borderRadius : "8px";
  const borderColor = color
    ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`
    : "rgba(33, 33, 33, 0.15)";

  return (
    <div
      className={`group relative z-0 flex h-9 cursor-pointer flex-col items-center overflow-hidden rounded-[999px] border p-2 ${className} `}
      style={{
        borderRadius: brRadius,
        border: border === false ? "none" : `1px solid ${borderColor}`,
      }}
    >
      <h3
        style={{ color: color }}
        className="z-20 translate-y-[0%] rounded-[7px] text-[16px] font-[500] leading-[19px] transition-all duration-0 group-hover:-translate-y-[150%] group-hover:duration-300"
      >
        {title}
      </h3>
      <h3
        style={{ color: color }}
        className="z-20 translate-y-[50%] rounded-[7px] text-[16px] font-[500] leading-[19px] transition-all duration-0 group-hover:-translate-y-[100%] group-hover:duration-300"
      >
        {title}
      </h3>
    </div>
  );
};

export default ButtonV6;
