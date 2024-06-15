import React from 'react';

const CardV1 = ({ title, logo, description, shadow, btn }) => {
  const cardStyle = {
    boxShadow: shadow ? '0px 32px 52px -24px #00000026, 0px 13px 17.5px -6px #0000000d' : 'none',
  };

  const circleStyle = {
    position: 'absolute',
    border: '1px solid transparent',
    borderRadius: '50%',
    zIndex: 20,
    opacity: 0.3,
    backgroundImage: 'linear-gradient(0deg, #f2f2f2, #212121, #f2f2f2)',
    backgroundSize: '100% 150%',
    WebkitMask: 'linear-gradient(#f2f2f2 0 0) content-box, linear-gradient(#f2f2f2 0 0)',
    WebkitMaskComposite: 'destination-out',
    maskComposite: 'exclude',
    animation: 'gradientShift 3s ease infinite',
  };

  return (
    <>
      <div
        className="flex flex-col overflow-hidden w-[400px] border bg-[#fefefe] items-start justify-center rounded-2xl"
        style={cardStyle}
      >
        <div className="relative w-full h-[250px] flex overflow-hidden items-center justify-center bg-[#f9f9f9]">
          <div
            className="w-[24rem] h-[28rem] rotate-12 -left-0 -top-0"
            style={{ ...circleStyle, width: '24rem', height: '28rem', transform: 'translate(-50%, -50%)' }}
          ></div>
          <div
            className="w-[16rem] h-[20rem] rotate-12 -left-0 -top-0"
            style={{ ...circleStyle, width: '16rem', height: '20rem', transform: 'translate(-50%, -50%)', animationDelay: '1.5s' }}
          ></div>
          <div
            className="w-[10rem] h-[14rem] rotate-12 -left-0 -top-0"
            style={{ ...circleStyle, width: '10rem', height: '14rem', transform: 'translate(-50%, -50%)', animationDelay: '2s' }}
          ></div>
          <div
            className="w-[24rem] h-[28rem] right-0 bottom-0 rotate-12"
            style={{ ...circleStyle, width: '24rem', height: '28rem', transform: 'translate(50%, 50%)' }}
          ></div>
          <div
            className="w-[16rem] h-[20rem] right-0 rotate-12 bottom-0"
            style={{ ...circleStyle, width: '16rem', height: '20rem', transform: 'translate(50%, 50%)', animationDelay: '1.5s' }}
          ></div>
          <div
            className="w-[10rem] h-[14rem] right-0 rotate-12 bottom-0"
            style={{ ...circleStyle, width: '10rem', height: '14rem', transform: 'translate(50%, 50%)', animationDelay: '2s' }}
          ></div>
          <img className="object-cover object-center h-[100px] z-40" src={logo} alt="" />
        </div>
        <div className="p-2 flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className='text-[#212121aa]'>{description}</p>
          {btn &&
            <button className="flex group text-lg items-center justify-center gap-1 border rounded-full px-2 py-1 hover:bg-[#f9f9f9] transition-all">
              View
              <svg className="w-5 h-5 group-hover:size-0 transition-all" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.42999 4L15.5 10.07L9.42999 16.14" stroke="#212121" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                <path d="M4 10.0699L15 10.0699" stroke="#212121" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
              </svg>
            </button>
          }
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </>
  );
};

export default CardV1;
