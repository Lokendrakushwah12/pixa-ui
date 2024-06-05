import React, { useState } from 'react';

const ButtonV6 = ({ title, borderRadius,color, border, textColor }) => {
    const [hovered, setHovered] = useState(false);

    const txtColor = textColor ? textColor : '#212121';
    const brRadius = borderRadius ? borderRadius : '8px';
    const borderColor = color ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)` : 'rgba(33, 33, 33, 0.15)';

    return (
        <div
            className="border flex flex-col items-center p-2 h-9 relative z-0 group rounded-[999px] overflow-hidden cursor-pointer"
            style={{ borderRadius: brRadius, border: border === false ? 'none' : `1px solid ${borderColor}` }}
        >
            <h3
                style={{ color: color }}
                className="z-20 rounded-[7px] translate-y-[0%] group-hover:-translate-y-[150%] transition-all font-[500] text-[16px] leading-[19px] duration-0 group-hover:duration-300"
            >
                {title}
            </h3>
            <h3
                style={{ color: color }}
                className="z-20 rounded-[7px] translate-y-[50%] group-hover:-translate-y-[100%] transition-all font-[500] text-[16px] leading-[19px] duration-0 group-hover:duration-300"
            >
                {title}
            </h3>
        </div>
    );
};

export default ButtonV6;
