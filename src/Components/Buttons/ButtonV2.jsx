import React from 'react'

const ButtonV2 = () => {
    return (
        <>
            <div className="border flex items-center relative z-0 group rounded-[999px] overflow-hidden cursor-pointer">
                <div className="absolute z-10 left-1/2 -bottom-3/4 -translate-x-1/2 -translate-y-3 bg-[#f8b63b] w-3 h-3 group-hover:w-32 group-hover:h-32 rounded-full transition-all duration-500"></div>
                <h3 className='z-20 rounded-[7px] cursor-pointer p-2 text-[#212121] hover:text-[#121212] transition-all font-[500] text-[16px] leading-[19px]'>
                    ButtonV2
                </h3>
            </div>
        </>
    )
}

export default ButtonV2