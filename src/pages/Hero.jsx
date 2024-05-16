import React from 'react'
import Button from './Button'
import TabV1 from '../Components/Current/TabV1'
import Nav from '../Components/Current/Nav';
import Card from './Card';

const Hero = () => {
    const [active, setActive] = React.useState(0);





    return (
        <>
            <Nav />
            <div className="flex flex-col items-center justify-center h-[300px]">
                <h1 className="text-4xl font-bold text-gray-800 text-center mt-8">Pixa UI</h1>
                <h2 className="text-lg text-gray-500 text-center mt-2">A collection of UI components for your project</h2>
            </div>

            <div className="flex flex-col gap-4 w-full max-w[1440px] px-auto items-center justify-start h-screen">
                <div className="flex items-center justify-center x-sm:justify-start mt-8 w-full overflow-x-auto hide-scrollbar transition-all">
                    <button className={`text-lg font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 0 ? 'border-blue-500 text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(0)}>Button</button>
                    <button className={`text-lg font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 1 ? 'border-blue-500 text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(1)}>Cards</button>
                    <button className={`text-lg font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 2 ? 'border-blue-500 text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(2)}>Tabs</button>
                    <button className={`text-lg font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 3 ? 'border-blue-500 text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(3)}>Modals</button>
                    <button className={`text-lg font-[500] px-4 border-b-2 hover:text-[#212121] transition-all ${active === 4 ? 'border-blue-500 text-[#212121]' : 'border-[#ffffff86] text-[#818181]'}`} onClick={() => setActive(4)}>Navbars</button>
                </div>
                {active === 0 && <Button />}
                {active === 1 && <Card />}

            </div>
        </>
    )
}

export default Hero