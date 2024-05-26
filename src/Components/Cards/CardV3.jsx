import React from 'react'

const CardV3 = ({ title, featureName, icon, description, shadow }) => {
  const cardStyle = {
    boxShadow: shadow ? '0px 32px 52px -24px #00000026, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  return (
    <>
      <div
        className="flex flex-col overflow-hidden h-[280px] w-[250px] border-8 border-[#fff] outline-dashed outline-[1px] outline-[#e9e9e9] bg-[#fbfbfb] items-start justify-between p-4 rounded-[2.5rem] cursor-pointer"
        style={cardStyle}
      >
        <h1 className='text-2xl font-[500] text-[#212121aa]'>{featureName}</h1>
        <div className='flex flex-col gap-0'>
          <img className='w-12 h-12' src={icon} alt="" />
          <h1 className="text-2xl font-[500] text-[#212121]">{title}</h1>
          <h1 className="text-base font-[400] text-[#212121aa]">{description}</h1>
        </div>
      </div>

    </>
  )
}

export default CardV3