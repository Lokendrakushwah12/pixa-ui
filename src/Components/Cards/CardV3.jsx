import React from 'react'

const CardV3 = ({ title, icon, description, shadow, btn }) => {
  const cardStyle = {
    boxShadow: shadow ? '0px 32px 52px -24px #00000026, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  return (
    <>
      <div
        className="flex flex-col overflow-hidden h-[300px] w-[400px] border-8 border-[#fff] bg-[#fbfbfb] items-start justify-between p-4 rounded-2xl cursor-pointer"
        style={cardStyle}
      >
        {/* <div className="bg-[#fbfbfb] border-4 border-[#fff] w-full h-full rounded-lg flex flex-col justify-between py-2"> */}
        <h1>
          Stalwart Group
        </h1>
        <div className='flex flex-col gap-1'>
          <img className='w-12 h-12' src={icon} alt="" />
          <h1 className="text-2xl font-[400] text-[#212121]">{title}</h1>
          <h1 className="text-base font-[300] text-[#212121d4]">{description}</h1>
        </div>
        {/* </div> */}
      </div>

    </>
  )
}

export default CardV3