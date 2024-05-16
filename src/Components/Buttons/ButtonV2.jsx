import React from 'react';

const ButtonV2 = ({ title, color, textColor }) => {
    const bgColor = color ? color : '#f8b63b';
    const txtColor = textColor ? textColor : '#212121';

    return (
        <div className="border flex items-center relative z-0 group rounded-[999px] overflow-hidden cursor-pointer">
            <div
                style={{ backgroundColor: bgColor }}
                className="absolute z-10 left-1/2 -bottom-3/4 -translate-x-1/2 -translate-y-3 w-3 h-3 group-hover:w-32 group-hover:h-32 rounded-full transition-all duration-500"
            ></div>
            <h3
                style={{ color: txtColor }}
                className="z-20 rounded-[7px] p-2 transition-all font-[500] text-[16px] leading-[19px]"
            >
                {title}
            </h3>
        </div>
    );
};

export default ButtonV2;
