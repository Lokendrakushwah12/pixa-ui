import React from 'react'

const CardV2 = ({ title, logo, description, shadow, btn }) => {
  const cardStyle = {
    boxShadow: shadow ? '0px 32px 32px -24px #00000077, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  return (
    <>
      <div
        className="relative flex flex-col overflow-hidden h-[300px] w-[400px] border bg-[#fefefe] items-start justify-center rounded-2xl cursor-pointer"
        style={cardStyle}
      >
        <div className="rectangle" />
        <div className='absolute top-4 left-4 flex justify-center items-center gap-1 text-[#ffffffd4] z-10'><img className='w-5 h-5' src={logo} alt="" />Stalwart Group</div>
        {/* <video className='h-full w-full object-fill' src="https://player.vimeo.com/video/950545795?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" loop={true} autoPlay={true} /> */}
        <iframe
          className='object-fill w-full h-full scale-150 cursor-pointer z-0'
          src="https://player.vimeo.com/video/950545795?background=1&dnt=1&autoplay=1&loop=1&muted=1"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Waves"
        ></iframe>
        <div className='absolute bottom-4 left-4 flex flex-col justify-center items-start w-full z-10'>
          <h1 className="text-2xl font-[400] text-[#fff]">{title}</h1>
          <h1 className="text-base font-[300] text-[#ffffffd4]">{description}</h1>
        </div>
      </div>

    </>
  )
}

export default CardV2