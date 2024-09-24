import React from 'react';
import { motion } from 'framer-motion';

const Part = ({ delay, verticalDelay }) => {
    return (
        <div className="flex flex-col items-start justify-center w-[164px]">
            <div className="flex items-center justify-center">
                <div className="h-6 w-6 bg-neutral-900 flex items-center justify-center rounded-full">
                    <div className="h-2 w-2 bg-neutral-700 rounded-full"></div>
                </div>
                <svg
                    width="140"
                    height="1"
                    viewBox="0 0 140 1"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-neutral-800"
                >
                    <path d="M0.5 0.5H479" stroke="#212121"></path>
                    <path
                        d="M0.5 0.5H479"
                        stroke={`url(#gradient-horizontal-${delay})`}
                        strokeWidth="1"
                    ></path>
                    <defs>
                        <motion.linearGradient
                            id={`gradient-horizontal-${delay}`}
                            gradientUnits="userSpaceOnUse"
                            initial={{ x1: -200, y1: 0, x2: -100, y2: 0 }}
                            animate={{ x1: 400, y1: 0, x2: 600, y2: 0 }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                delay,
                                ease: "linear"
                            }}
                        >
                            <stop offset="0%" stopColor="transparent"></stop>
                            <stop offset="50%" stopColor="#777"></stop>
                            <stop offset="100%" stopColor="transparent"></stop>
                        </motion.linearGradient>
                    </defs>
                </svg>
            </div>
            <svg
                width="1"
                height="140"
                viewBox="0 0 1 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-neutral-800 ml-3"
            >
                <path d="M0.5 0.5V479" stroke="#212121" strokeWidth="2"></path>
                <path
                    d="M0.5 0.5V479"
                    stroke={`url(#gradient-vertical-${verticalDelay})`}
                    strokeWidth="2"
                ></path>
                <defs>
                    <motion.linearGradient
                        id={`gradient-vertical-${verticalDelay}`}
                        gradientUnits="userSpaceOnUse"
                        initial={{ x1: 2, y1: -200, x2: 2, y2: -100 }}
                        animate={{ x1: 2, y1: 400, x2: 2, y2: 600 }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: verticalDelay,
                            ease: "linear"
                        }}
                    >
                        <stop offset="0%" stopColor="transparent"></stop>
                        <stop offset="50%" stopColor="#777"></stop>
                        <stop offset="100%" stopColor="transparent"></stop>
                    </motion.linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default Part;