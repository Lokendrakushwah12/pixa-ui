import React from 'react'

const CardV4 = ({ title, featureName, icon, description, shadow }) => {
  // const cardStyle = {
  //   backgroundImage: `https://i.ibb.co/WnfMX05/bg3.png`,
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  //   backgroundRepeat: 'no-repeat',
  //   boxShadow: shadow ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none'
  // };

  return (
    <>
      <div
        className="flex flex-col overflow-hidden h-[280px] w-[300px] border items-start justify-between p-4 rounded-[2rem] cursor-pointer"
        style={{ backgroundImage: `url('https://i.ibb.co/WnfMX05/bg3.png')`, backgroundSize: 'cover', backgroundPosition:'top', backgroundRepeat: 'no-repeat', boxShadow: shadow ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none'}}
      >
        <div className="flex justify-center items-center gap-1">
          <img className='w-6 h-6' src={icon} alt="" />
          <h1 className='text-base font-[300] text-[#fffd]' style={{ textShadow: "0px 1px 2px #0005" }}>{featureName}</h1>
        </div>
        <div className='flex flex-col gap-0 justify-center items-center'>
          <h1 className="text-2xl font-[500] text-[#212121]">{title}</h1>
          <div className="w-full h-[1px] bg-[#ebebe4] my-2"></div>
          <h1 className="text-base font-[400] w-full text-[#212121aa] text-center tracking-[-0.04em] leading-[1.2rem]">{description}</h1>
        </div>
      </div>
    </>
  )
}

export default CardV4