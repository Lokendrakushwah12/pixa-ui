import React from 'react'

const ButtonV1 = ({ title, color, border }) => {
    let bgColor = color ? color : '#212121';
    let borderColor = border ? border : '#121212';

    return (
        <>
            <div className={`relative group border border-[${borderColor}] rounded-[8px] bg-[${bgColor}] `}>
                <div className="border-t border-[#788086] rounded-[7px]">
                    <div className={`absolute w-3/4 h-2 bg-[#fff] rounded-full blur-lg opacity-75 group-hover::opacity-0 -translate-x-1/2 -translate-y-1/2 left-1/2 `}></div>
                    <h3 className={`bg-[${bgColor}] hover:bg-[#313131] rounded-[7px] cursor-pointer p-2 text-[#f0f0f0] hover:text-[#e9e9e9] transition-all font-[500] text-[16px] leading-[19px] `}>
                        {title}
                    </h3>
                </div>
            </div>
        </>
    )
}

export default ButtonV1