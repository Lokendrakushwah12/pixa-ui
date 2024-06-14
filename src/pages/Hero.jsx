import React from 'react';
import ButtonPage from './ButtonPage';
import CardPage from './CardPage';
import HomePage from './HomePage';
import ScrollToTop from '../Components/Current/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import Nav from '../Components/Current/Nav';

const tabs = ['Button', 'Cards', 'Tabs', 'Modals', 'Navbars'];

const Hero = () => {
    const [active, setActive] = React.useState(tabs[0]);

    return (
        <>
            <Nav />
            <HomePage />
            <div className="flex flex-col gap-4 w-full max-w[1440px] px-auto items-center justify-start h-screen">
                <div className={'mb-8 flex flex-wrap items-center gap-2 xsm border-b border-gray-200 dark:border[#515151]'}>
                    {tabs.map((text) => (
                        <button
                            key={text}
                            onClick={() => setActive(text)}
                            className={` ${active === text ? 'text-[#212121]' : ' text-[#515151]'} relative rounded-md  px-2 py-1 text-sm font-medium hover:text-[#212121] transition-all duration-300`}
                        >
                            <span className="relative z-10 text-lg font-[500] xsm">{text}</span>
                            {active === text && (
                                <motion.div
                                    className="absolute left-0 bottom-0 flex size-full h-full w-full items-end justify-center"
                                    layoutId='underline'
                                    transition={{ type: 'spring', duration: 0.4, bounce: 0, delay: 0.1 }}
                                >
                                    <span className="z-0 h-[3px] w-3/4 bg-[#212121] rounded-t-sm"></span>
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
                {active === 'Button' && <ButtonPage />}
                {active === 'Cards' && <CardPage />}
            </div>
            <AnimatePresence>
                <ScrollToTop />
            </AnimatePresence>
        </>
    );
};

export default Hero;
