import React from 'react'
import ButtonPage from './ButtonPage'
import TabV1 from '../Components/Current/TabV1'
import Nav from '../Components/Current/Nav';
import CardPage from './CardPage';
import HomePage from './HomePage';
import ScrollToTop from '../Components/Current/ScrollToTop';
import { AnimatePresence } from 'framer-motion';

const Hero = () => {
    const [active, setActive] = React.useState(0);





    return (
        <>
            <Nav />
            <HomePage />
            <div className="flex flex-col gap-4 w-full max-w[1440px] px-auto items-center justify-start h-screen">
                <div className="flex items-center justify-center x-sm:justify-start mt-8 w-full overflow-x-auto hide-scrollbar transition-all">
                    <div className={`text-lg cursor-pointer font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 0 ? 'border-[#212121] text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(0)}>Button</div>
                    <div className={`text-lg cursor-pointer font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 1 ? 'border-[#212121] text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(1)}>Cards</div>
                    <div className={`text-lg cursor-pointer font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 2 ? 'border-[#212121] text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(2)}>Tabs</div>
                    <div className={`text-lg cursor-pointer font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 3 ? 'border-[#212121] text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(3)}>Modals</div>
                    <div className={`text-lg cursor-pointer font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 4 ? 'border-[#212121] text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(4)}>Navbars</div>
                </div>
                {active === 0 && <ButtonPage />}
                {active === 1 && <CardPage />}
            </div>
            <AnimatePresence>
                <ScrollToTop />
            </AnimatePresence>
        </>
    )
}

export default Hero