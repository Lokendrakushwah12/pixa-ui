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

            <div className="flex flex-col gap-4 w-full max-w[1440px] xl:w-[1500px] items-center justify-start h-screen">
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button className={`text-sm font-semibold text-gray-800 ${active === 0 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActive(0)}>Button</button>
                    <button className={`text-sm font-semibold text-gray-800 ${active === 1 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActive(1)}>Cards</button>
                    <button className={`text-sm font-semibold text-gray-800 ${active === 2 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActive(2)}>Tabs</button>
                    <button className={`text-sm font-semibold text-gray-800 ${active === 3 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActive(3)}>Modals</button>
                    <button className={`text-sm font-semibold text-gray-800 ${active === 4 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActive(4)}>Navbars</button>
                </div>
                {active === 0 && <Button />}
                {active === 1 && <Card />}
                
            </div>
        </>
    )
}

export default Hero