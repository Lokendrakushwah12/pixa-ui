import React, { useState, useEffect, useRef } from 'react';

const ButtonV7 = ({ title, color, textColor }) => {
    const [hovered, setHovered] = useState(false);
    const [scrambledText, setScrambledText] = useState(title);
    const intervalRefs = useRef([]);
    const timeoutRefs = useRef([]);

    const txtColor = textColor ? textColor : '#212121';
    const borderColor = color ? `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)` : 'rgba(33, 33, 33, 0.15)';

    const scrambleText = (text, scrambleIndices) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$£€¥';
        const scrambled = text.split('');
        scrambleIndices.forEach(i => {
            if (text[i] !== ' ') {
                const randChar = chars[Math.floor(Math.random() * chars.length)];
                scrambled[i] = randChar;
            }
        });
        return scrambled.join('');
    };

    useEffect(() => {
        if (hovered) {
            let scrambleIndices = [];
            title.split('').forEach((char, index) => {
                if (char !== ' ') {
                    const scrambleTimeout = setTimeout(() => {
                        scrambleIndices.push(index);
                        intervalRefs.current[index] = setInterval(() => {
                            setScrambledText(prev => scrambleText(title, scrambleIndices));
                        }, 50); // time for each character to change
                        timeoutRefs.current[index] = setTimeout(() => {
                            clearInterval(intervalRefs.current[index]);
                            scrambleIndices = scrambleIndices.filter(i => i !== index);
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
            className="flex flex-col items-center hover:bg-[#212121] relative z-0 group cursor-pointer duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                intervalRefs.current.forEach(clearInterval);
                timeoutRefs.current.forEach(clearTimeout);
                setHovered(false);
                setScrambledText(title);
            }}
            style={{ width: '130px' }}
        >
            <div className="flex justify-between items-center w-full">
                <div className="border-l-[1px] border-t-[1px] border-[#212121] w-2 h-2">‎</div>
                <div className="border-r-[1px] border-t-[1px] border-[#212121] w-2 h-2">‎</div>
            </div>
            <h3
                style={{ color: color }}
                className="z-20 text-[#212121] text-left group-hover:text-[#f2f2f4] transition-all font-[400] text-[16px] leading-[19px] duration-300"
            >
                {hovered ? scrambledText : title}
            </h3>
            <div className="flex justify-between items-center w-full">
                <div className="border-l-[1px] border-b-[1px] border-[#212121] w-2 h-2">‎</div>
                <div className="border-r-[1px] border-b-[1px] border-[#212121] w-2 h-2">‎</div>
            </div>
        </div>
    );
};

export default ButtonV7;