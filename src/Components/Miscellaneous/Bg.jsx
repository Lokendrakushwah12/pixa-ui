import React, { useMemo } from 'react';
import Part from './Part';

const Bg = () => {
    const rows = 4;
    const cols = 9;

    const createRandomDelays = (rows, cols) => {
        const delays = [];
        const baseDelay = 0.1;
        const randomFactor = 0.3;
        const patternFactor = 0.2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const randomDelay = Math.random() * randomFactor;

                const patternDelay = Math.sin(i / rows * Math.PI) * Math.cos(j / cols * Math.PI) * patternFactor;

                const delay = (baseDelay + randomDelay + patternDelay + i * 0.5 + j * 0.3);

                delays.push(delay);
            }
        }
        return delays;
    };

    const randomDelays = useMemo(() => createRandomDelays(rows, cols), [rows, cols]);

    console.log(randomDelays);

    return (
        <div className='absolute inset-0 h-full w-full pointer-events-none z-0'>
            <div className="absolute inset-0 h-full w-full bg-[#121212] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,#121212,transparent)]">
                <div className="absolute -z-50">
                    <div className="flex flex-col">
                        {[...Array(rows)].map((_, rowIndex) => (
                            <div className="flex" key={rowIndex}>
                                {[...Array(cols)].map((_, colIndex) => {
                                    const index = rowIndex * cols + colIndex;
                                    return (
                                        <Part
                                            key={index}
                                            delay={randomDelays[index]}
                                            verticalDelay={(randomDelays[index] * 1.5 + 3) % 1}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bg;