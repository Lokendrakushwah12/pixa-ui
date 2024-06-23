import React, { useState, useRef, useEffect } from 'react';

const CardV2 = ({
  title,
  topHeading,
  logo,
  description,
  width = '400px',
  height = '300px',
  shadow = false,
  fade = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const cardStyle = {
    width: '100%',
    height: '100%',
    boxShadow: shadow
      ? '0px 32px 32px -24px #00000077, 0px 13px 17.5px -6px #0000000d'
      : 'none',
    backgroundImage:
      'url(https://images.pexels.com/photos/2927854/pexels-photo-2927854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
    zIndex: '10',
  };

  const maskStyle = fade
    ? {
        maskImage: 'radial-gradient(circle, transparent 40%, white 90%)',
        WebkitMaskImage: 'radial-gradient(circle, transparent 40%, white 90%)',
        borderRadius: '1rem',
        overflow: 'hidden',
        backdropFilter: 'blur(32px)',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
      }
    : {};

  const borderAnimationStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${rotation}turn)`,
    aspectRatio: '1',
    width: 'calc(100% + 400px)',
    height: 'calc(100% + 400px)',
    borderRadius: 'inherit',
    background: 'conic-gradient(transparent 270deg, #44a2b3, transparent)',
    animation: isHovered ? 'rotate 3s linear infinite' : 'none',
    transition: isHovered ? 'none' : 'transform 0.5s ease-out',
  };

  const overlayStyle = {
    content: "''",
    position: 'absolute',
    inset: '2px',
    borderRadius: 'inherit',
    background: 'inherit',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    startTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(trackRotation);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    cancelAnimationFrame(animationRef.current);
  };

  const trackRotation = (time) => {
    const elapsedTime = (time - startTimeRef.current) / 1000; // convert to seconds
    const newRotation = (elapsedTime % 3) / 3; // cycle every 3 seconds
    setRotation(newRotation);
    animationRef.current = requestAnimationFrame(trackRotation);
  };

  return (
    <div
      className="border"
      style={{
        width: '400px',
        height: '300px',
        position: 'relative',
        padding: '2px',
        overflow: 'hidden',
        borderRadius: '18px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute w-full h-full -rotate-90">
        <div style={borderAnimationStyle}></div>
        <div style={overlayStyle}></div>
      </div>
      <div className="absolute w-full h-full rotate-90">
        <div style={borderAnimationStyle}></div>
        <div style={overlayStyle}></div>
      </div>
      <div
        className="relative flex flex-col bg-[#fefefe] items-start justify-center rounded-2xl cursor-pointer"
        style={cardStyle}
      >
        <div
          className="absolute top-4 left-4 flex justify-center items-center gap-1 text-[#ffffffd4] z-50"
          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.15)' }}
        >
          {logo}
          {topHeading}
        </div>
        <div className="absolute w-full h-full" style={maskStyle} />
        <div className="absolute bottom-4 left-4 flex flex-col justify-center items-start w-full z-50">
          <h1
            className="text-2xl font-[400] text-[#fff]"
            style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.15)' }}
          >
            {title}
          </h1>
          <h1 className="text-base font-[300] text-[#ffffffd4]">
            {description}
          </h1>
        </div>
        <style>
          {`
          @keyframes rotate {
            from {
              transform: translate(-50%, -50%) rotate(0turn);
            }
            to {
              transform: translate(-50%, -50%) rotate(1turn);
            }
          }
        `}
        </style>
      </div>
    </div>
  );
};

export default CardV2;
