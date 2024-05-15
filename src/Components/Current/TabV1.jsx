import React from 'react'

const TabV1 = () => {
    return (
        <>
            {/* tabs for button, cards, tabs, accordian, nav */}
            <div className="flex justify-center items-center ">
                <div className="flex items-center justify-center hover:bg-[#f0f0f0] hover:border-b-[#616161] border-b transition-all cursor-pointer p-2">
                    <h3 className="text-[#212121] font-[500] text-[20px]">Button</h3>
                </div>
                <div className="flex items-center justify-center hover:bg-[#f0f0f0] hover:border-b-[#616161] border-b transition-all cursor-pointer p-2">
                    <h3 className="text-[#212121] font-[500] text-[20px]">Card</h3>
                </div>
                <div className="flex items-center justify-center hover:bg-[#f0f0f0] hover:border-b-[#616161] border-b transition-all cursor-pointer p-2">
                    <h3 className="text-[#212121] font-[500] text-[20px]">Tab</h3>
                </div>
                <div className="flex items-center justify-center hover:bg-[#f0f0f0] hover:border-b-[#616161] border-b transition-all cursor-pointer p-2">
                    <h3 className="text-[#212121] font-[500] text-[20px]">Accordian</h3>
                </div>
                <div className="flex items-center justify-center hover:bg-[#f0f0f0] hover:border-b-[#616161] border-b  transition-all cursor-pointer p-2">
                    <h3 className="text-[#212121] font-[500] text-[20px]">Nav</h3>
                </div>
            </div>
        </>
    )
}

export default TabV1