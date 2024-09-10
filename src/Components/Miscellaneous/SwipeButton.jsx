import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';

const SwipeButton = () => {
    const containerWidth = 300;  // Width of the container
    const buttonWidth = 150;     // Width of the swipe button
    const [isSwiped, setIsSwiped] = useState(false);
    const [dragStyles, api] = useSpring(() => ({ x: 0 }));

    const handleSwipe = ({ active, movement: [mx] }) => {
        const threshold = (containerWidth - buttonWidth) / 2;

        if (!active && mx > threshold) {
            setIsSwiped(true);
            api.start({ x: containerWidth - buttonWidth }); // Stop at container edge
        } else if (!active) {
            setIsSwiped(false);
            api.start({ x: 0 });
        } else {
            api.start({ x: mx < containerWidth - buttonWidth ? mx : containerWidth - buttonWidth }); // Clamp movement within container
        }
    };

    const bind = useDrag(handleSwipe, {
        bounds: { left: 0, right: containerWidth - buttonWidth }, // Constrain button drag within the container
        axis: 'x',
        rubberband: false,
    });

    return (
        <div
            className="relative flex items-center justify-center border w-[310px] border-[#d2d2d6] p-2 shadow-md rounded-full"
            style={{
                backgroundImage: `linear-gradient(to top, #f2f2f2 -50%,#fff 50%)`,
                transition: "all 0.3s ease-out",
            }}
        >
            <div className="relative z-10 text-black font-medium select-none">&nbsp;</div>

            <animated.button
                {...bind()}
                className="absolute left-1 z-20 flex items-center justify-center shadow-md px-2 py-1 border border-[#d2d2d6] bg-white rounded-full"
                style={{
                    ...dragStyles,
                    width: `${buttonWidth}px`, // Ensure the button width matches
                }}
            >
                <span className="text-indigo-500 font-bold">Slide to Start &#8594;</span>
            </animated.button>
        </div>
    );
};

export default SwipeButton;
