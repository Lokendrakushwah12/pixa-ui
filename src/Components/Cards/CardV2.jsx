import React from 'react'

const CardV2 = ({ title, logo, description, shadow, fade = false }) => {

  const cardStyle = {
    boxShadow: shadow ? '0px 32px 32px -24px #00000077, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  const maskStyle = fade
    ? {
      maskImage: 'radial-gradient(circle, transparent 30%, white 90%)',
      WebkitMaskImage: 'radial-gradient(circle, transparent 30%, white 90%)',
      borderRadius: '1rem',
      overflow: 'hidden',
      backdropFilter: 'blur(32px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
    : {};

  return (
    <>
      <div
        className="relative flex flex-col overflow-hidden h-[300px] w-[400px] bg-[#fefefe] items-start justify-center rounded-2xl cursor-pointer"
        style={cardStyle}
      >

        <div className='absolute top-4 left-4 flex justify-center items-center gap-1 text-[#ffffffd4] z-50'><img className='w-5 h-5' src={logo} alt="" />Stalwart Group</div>
        <div className="absolute w-full h-full" style={{ ...maskStyle, }} />
        <video className='h-full w-full object-fill' src="https://videos.pexels.com/video-files/10994876/10994876-hd_1080_1920_25fps.mp4" autoPlay loop muted playsInline></video>
        <div className='absolute bottom-4 left-4 flex flex-col justify-center items-start w-full z-50'>
          <h1 className="text-2xl font-[400] text-[#fff]">{title}</h1>
          <h1 className="text-base font-[300] text-[#ffffffd4]">{description}</h1>
        </div>
      </div>

    </>
  )
}

export default CardV2