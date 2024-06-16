import React, { useState } from 'react';

const ButtonV2 = ({ title, color, borderRadius, background, border, textColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const bgColor = color ? color : '#212121';
    const borderColor = `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(bgColor.slice(3, 5), 16)}, ${parseInt(bgColor.slice(5, 7), 16)}, 0.15)`;
    const txtColor = textColor ? textColor : '#212121';
    const brRadius = borderRadius ? borderRadius : '8px';
    const textifbgisfalse = background!=false ? "#fff" : "212121";

    return (
        <div
            className="border flex flex-col items-center p-2 h-9 relative z-0 group rounded-[999px] overflow-hidden cursor-pointer"
            style={{ borderRadius: brRadius, border: border == false ? 'none' : `1px solid ${borderColor}`}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                style={{ backgroundColor: bgColor }}
                className="absolute z-10 left-1/2 -bottom-3/4 -translate-x-1/2 -translate-y-3 w-3 h-3 group-hover:w-32 group-hover:h-32 rounded-full transition-all duration-500"
            ></div>
            <h3
                style={{ color: isHovered ? '#ffffff' : txtColor }}
                className="z-20 rounded-[7px] translate-y-[0%] group-hover:-translate-y-[150%] transition-all font-[500] text-[16px] leading-[19px] duration-300"
            >
                {title}
            </h3>
            <h3
                style={{ color: isHovered ? textifbgisfalse : txtColor }}
                className="z-20 rounded-[7px] translate-y-[50%] group-hover:-translate-y-[100%] transition-all font-[500] text-[16px] leading-[19px] duration-300"
            >
                {title}
            </h3>
        </div>
    );
};

export default ButtonV2;
