import React, { useState } from 'react';

const ButtonV4 = ({ title, borderRadius, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Default Values
    const brRadius = borderRadius ? borderRadius : '8px';
    const Bgcolor = color ? color : '#212121';

    return (
        <>
            <div
                className="border relative group rounded-full p-2 overflow-hidden pr-0 hover:pl-0 hover:pr-2 flex items-center justify-center cursor-pointer transition-all duration-500"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ borderRadius: brRadius, backgroundColor: isHovered ? Bgcolor : '#ffffff' }}
            >
                <svg
                    style={{ backgroundColor: Bgcolor }}
                    className="w-6 h-6 p-1 translate-x-[0%] group-hover:-translate-x-[150%] rounded-full rotate-90 transition-all" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.42999 4L15.5 10.07L9.42999 16.14" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                    <path d="M4 10.0699L15 10.0699" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                </svg>
                <h3
                    style={{ color: isHovered ? '#ffffff' : '#000000' }}
                    className="z-20 transition-all translate-x-[20%] group-hover:-translate-x-[20%] font-[500] text-[16px]"
                >
                    {title}
                </h3>
                <svg className="w-6 h-6 p-1 translate-x-[150%] group-hover:translate-x-[0%] rounded-full rotate-90 bg-[#fff] transition-all" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.42999 4L15.5 10.07L9.42999 16.14" stroke="#212121" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                    <path d="M4 10.0699L15 10.0699" stroke="#212121" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                </svg>
            </div>
        </>
    );
};

export default ButtonV4;