import React, { useState } from 'react'

const CardV3 = ({ title, featureName, icon, description, shadow }) => {
  const [hovered, setHovered] = useState(false);
  const cardStyle = {
    boxShadow: shadow ? '0px 32px 52px -24px #00000026, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  return (
    <>
      <div
        className="flex flex-col relative overflow-hidden group h-[280px] w-[250px] border-4 border-[#fff] outline-dashed outline-[1px] outline-[#e9e9e9] bg-[#fbfbfb] items-start justify-between p-4 rounded-[2.5rem] cursor-pointer"
        style={cardStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute w-32 h-24 right-0 top-0 blur-[64px] opacity-50 group-hover:opacity-60"
          style={{
            backgroundImage: `linear-gradient(to right, #FF00A4 -20%, #000 140%, #fff)`,
            boxShadow: hovered ? `inset 0px 2px 3px 0 rgba(255,255,255,0.1), inset 0 0px 3px 0 rgba(255,255,255,0.4), inset 0 -5px 20px 0 rgba(255,255,255,0.15), -1px 2px 4px rgba(0,0,0,0.3), 0px 0px 30px #9a9f9d` : `inset 0px 2px 3px 0 rgba(255,255,255,0.02), inset 0 0px 3px 0 rgba(255,255,255,0.2), inset 0 -5px 20px 0 rgba(255,255,255,0.1), 0px 2px 4px rgba(0,0,0,0.2), 0px 0px 30px #9a9f9d`,
            transition: 'all 0.3s ease-out',
          }}></div>
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