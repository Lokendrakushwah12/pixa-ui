import React, { useState } from 'react';

const ButtonV1 = ({ title, borderRadius, border, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Default Values
    const brRadius = borderRadius ? borderRadius : '8px';
    const colour = color ? color : '#212121';
    const borderColor = `rgba(${parseInt(colour.slice(1, 3), 16)}, ${parseInt(colour.slice(3, 5), 16)}, ${parseInt(colour.slice(5, 7), 16)}, 0.15)`;

    return (
        <>
            <div
                className="border relative group rounded-full p-2 overflow-hidden pl-0 hover:pr-0 hover:pl-2 flex items-center justify-center cursor-pointer transition-all duration-500"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ borderRadius: brRadius, border: border==false ? 'none' : '1px solid #e5e7eb', borderColor: borderColor}}
            >
                <svg
                    className="w-6 h-6 p-1 -translate-x-[150%] group-hover:translate-x-[0%] transition-all duration-300" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.42999 4L15.5 10.07L9.42999 16.14" stroke={colour} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                    <path d="M4 10.0699L15 10.0699" stroke={colour} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                </svg>
                <h3
                    className="z-20 transition-all -translate-x-[20%] group-hover:translate-x-[20%] font-[500] text-[16px] duration-300"
                    style={{ color: colour }}
                >
                    {title}
                </h3>
                <svg className="w-6 h-6 p-1 translate-x-[0%] group-hover:translate-x-[150%] transition-all duration-300" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.42999 4L15.5 10.07L9.42999 16.14" stroke={colour} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                    <path d="M4 10.0699L15 10.0699" stroke={colour} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                </svg>
            </div>
        </>
    );
};

export default ButtonV1;