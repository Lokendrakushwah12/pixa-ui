import React from 'react'

const CardV2 = ({ title, logo, description, shadow, btn }) => {

  const cardStyle = {
    boxShadow: shadow ? '0px 32px 32px -24px #00000077, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  const overlayStyles = [
    // {
    //   backdropFilter: 'blur(0.117188px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 37.5%)',
    // },
    // {
    //   backdropFilter: 'blur(0.234375px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgba(0, 0, 0, 0) 50%)',
    // },
    // {
    //   backdropFilter: 'blur(0.46875px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 62.5%)',
    // },
    // {
    //   backdropFilter: 'blur(0.9375px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgba(0, 0, 0, 0) 75%)',
    // },
    // {
    //   backdropFilter: 'blur(1.875px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0) 87.5%)',
    // },
    // {
    //   backdropFilter: 'blur(3.75px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)',
    // },
    // {
    //   backdropFilter: 'blur(7.5px)',
    //   maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 75%, rgb(0, 0, 0) 87.5%, rgb(0, 0, 0) 100%)',
    // },
    {
      backdropFilter: 'blur(15px)',
      maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 87.5%, rgb(0, 0, 0) 100%)',
    },
  ];

  return (
    <>
      <div
        className="relative flex flex-col overflow-hidden h-[300px] w-[400px] bg-[#fefefe] items-start justify-center rounded-2xl cursor-pointer"
        style={cardStyle}
      >
        {/* <div className="absolute w-full h-1/2 top-0 rounded-none">
          {overlayStyles.map((style, index) => (
            <div
              key={index}
              className="absolute inset-0 pointer-events-none"
              style={{ ...style, zIndex: index + 1 }}
            />
          ))}
        </div> */}
        
        <div className='absolute top-4 left-4 flex justify-center items-center gap-1 text-[#ffffffd4] z-50'><img className='w-5 h-5' src={logo} alt="" />Stalwart Group</div>
        <video className='h-full w-full object-fill' src="https://videos.pexels.com/video-files/10994876/10994876-hd_1080_1920_25fps.mp4" /*autoPlay loop muted playsInline*/></video>
        {/* <iframe
          className='object-fill w-full h-full scale-150 cursor-pointer z-0'
          src="https://player.vimeo.com/video/950545795?background=1&dnt=1&autoplay=1&loop=1&muted=1"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Waves"
        ></iframe> */}
        <div className='absolute bottom-4 left-4 flex flex-col justify-center items-start w-full z-50'>
          <h1 className="text-2xl font-[400] text-[#fff]">{title}</h1>
          <h1 className="text-base font-[300] text-[#ffffffd4]">{description}</h1>
        </div>
      </div>

    </>
  )
}

export default CardV2