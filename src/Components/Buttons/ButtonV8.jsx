import React, { useState, useEffect, useRef } from "react";

const ButtonV8 = ({ title, color, textEffect, textColor, className }) => {
  const [hovered, setHovered] = useState(false);
  const [scrambledText, setScrambledText] = useState(title);
  const intervalRefs = useRef([]);
  const timeoutRefs = useRef([]);

  const txtColor = textColor ? textColor : "#212121";
  const colour = color ? color : "#212121";
  const bgColor = `rgba(${parseInt(colour.slice(1, 3), 16)}, ${parseInt(colour.slice(3, 5), 16)}, ${parseInt(colour.slice(5, 7), 16)}, 0.08)`;

  const scrambleText = (text, scrambleIndices) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$£€¥";
    const scrambled = text.split("");
    scrambleIndices.forEach((i) => {
      if (text[i] !== " ") {
        const randChar = chars[Math.floor(Math.random() * chars.length)];
        scrambled[i] = randChar;
      }
    });
    return scrambled.join("");
  };

  useEffect(() => {
    if (hovered) {
      let scrambleIndices = [];
      title.split("").forEach((char, index) => {
        if (char !== " ") {
          const scrambleTimeout = setTimeout(() => {
            scrambleIndices.push(index);
            intervalRefs.current[index] = setInterval(() => {
              setScrambledText((prev) => scrambleText(title, scrambleIndices));
            }, 50); // time for each character to change
            timeoutRefs.current[index] = setTimeout(() => {
              clearInterval(intervalRefs.current[index]);
              scrambleIndices = scrambleIndices.filter((i) => i !== index);
              setScrambledText(title);
            }, 300); // time for each character to stop changing
          }, index * 50); // time for each character to start changing
          timeoutRefs.current.push(scrambleTimeout);
        }
      });

      return () => {
        intervalRefs.current.forEach(clearInterval);
        timeoutRefs.current.forEach(clearTimeout);
      };
    }
  }, [hovered, title]);

  return (
    <div
      className={`group relative z-0 flex cursor-pointer flex-col items-center ${className} `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        intervalRefs.current.forEach(clearInterval);
        timeoutRefs.current.forEach(clearTimeout);
        setHovered(false);
        setScrambledText(title);
      }}
    >
      <div className="flex w-full items-center justify-between opacity-100 transition-all duration-300 group-hover:opacity-0">
        <svg
          className="-translate-x-1/2 translate-y-1/2"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 0V8" stroke={colour} stroke-width="0.8" />
          <path d="M0 4L8 4" stroke={colour} stroke-width="0.8" />
        </svg>
        <svg
          className="translate-x-1/2 translate-y-1/2"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 0V8" stroke={colour} stroke-width="0.8" />
          <path d="M0 4L8 4" stroke={colour} stroke-width="0.8" />
        </svg>
      </div>
      <h3
        className="z-20 flex items-center justify-center py-2 text-[16px] font-[400] leading-[19px] text-[#212121] transition-all duration-300 group-hover:text-[#f2f2f4]"
        style={{
          color: hovered ? "#f2f2f4" : colour,
          width: "100px",
          backgroundColor: hovered ? colour : bgColor,
        }}
      >
        {hovered && textEffect !== false ? scrambledText : title}
      </h3>
      <div className="flex w-full items-center justify-between opacity-100 transition-all duration-300 group-hover:opacity-0">
        <svg
          className="-translate-x-1/2 -translate-y-1/2"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 0V8" stroke={colour} stroke-width="0.8" />
          <path d="M0 4L8 4" stroke={colour} stroke-width="0.8" />
        </svg>
        <svg
          className="-translate-y-1/2 translate-x-1/2"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 0V8" stroke={colour} stroke-width="0.8" />
          <path d="M0 4L8 4" stroke={colour} stroke-width="0.8" />
        </svg>
      </div>
    </div>
  );
};

export default ButtonV8;
