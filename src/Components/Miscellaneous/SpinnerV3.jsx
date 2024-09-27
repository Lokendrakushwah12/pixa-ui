import React from 'react';

const SpinnerV3 = () => {
    return (
        <svg
            className="box-content text-primary w-8 h-8 animate-spin"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <circle 
                cx="8" 
                cy="8" 
                r="7" 
                stroke="currentColor" 
                strokeOpacity="0.25" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke" 
                fill="none" 
            />
            <path
                d="M15 8a7.002 7.002 0 00-7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
};

export default SpinnerV3;