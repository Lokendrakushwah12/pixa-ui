import React, { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CardV1 from '../Components/Cards/CardV1'
import Stalwarts from '../assets/icons/Stalwarts.svg';
import CardV2 from '../Components/Cards/CardV2';
import CardV3 from '../Components/Cards/CardV3';
import CardV4 from '../Components/Cards/CardV4';
import Drawer from '../Components/Buttons/Drawer';

const CardPage = () => {
    const [CardData, setCardData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [copied, setCopied] = useState({ installation: false, snippet: false });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); //drawer state

    const handleCopyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied({ ...copied, [type]: true });
            setTimeout(() => {
                setCopied({ ...copied, [type]: false });
            }, 1000);
        }).catch((err) => {
            console.error('Failed to copy: ', err);
        });
    };

    const renderCopyIcon = (isCopied) => (
        isCopied ? (
            <svg
                className='cursor-pointer p-1 rounded-full transition-all'
                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M20 6L9 17L4 12" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : (
            <svg
                className='cursor-pointer hover:bg-[#ffffff1d] p-1 rounded-full transition-all'
                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M20 8.25V18C20 21 18.21 22 16 22H8C5.79 22 4 21 4 18V8.25C4 5 5.79 4.25 8 4.25C8 4.87 8.24997 5.43 8.65997 5.84C9.06997 6.25 9.63 6.5 10.25 6.5H13.75C14.99 6.5 16 5.49 16 4.25C18.21 4.25 20 5 20 8.25Z" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 4.25C16 5.49 14.99 6.5 13.75 6.5H10.25C9.63 6.5 9.06997 6.25 8.65997 5.84C8.24997 5.43 8 4.87 8 4.25C8 3.01 9.01 2 10.25 2H13.75C14.37 2 14.93 2.25 15.34 2.66C15.75 3.07 16 3.63 16 4.25Z" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 13H12" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 17H16" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    );

    const toggleDrawer = (data) => { //toggle drawer function
        setIsDrawerOpen(!isDrawerOpen);
        setSelectedData(data);
        console.log(data);
    };

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const res = await fetch('./Data/cardData.json');
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setCardData(data);
            } catch (error) {
                console.error('Fetching error:', error);
            }
        };
        fetchCardData();
    }, []);

    return (
        <>
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedData && (
                    <div className="flex flex-col md:flex-row h-full w-full gap-4 pt-8">
                        <div className="md:w-1/2 w-full flex flex-col items-start justify-start gap-4">
                            {/* Install */}
                            <div className="w-full relative flex flex-col items-start justify-center gap-1">
                                <h1 className="text-xl text-gray-900 font-bold">Install the package</h1>
                                <div className='pr-2 text-sm text-gray-900 border bg-[#212121] border-gray-200 overflow-hidden flex justify-between items-center w-full rounded-lg'>
                                    <SyntaxHighlighter className="bg-black" language="bash" style={nightOwl}>
                                        {selectedData.installationCmd}
                                    </SyntaxHighlighter>
                                    <div onClick={() => handleCopyToClipboard(selectedData.installationCmd, 'installation')}>
                                        {renderCopyIcon(copied.installation)}
                                    </div>
                                </div>
                            </div>
                            {/* Usage 1 */}
                            <div className="w-full relative flex flex-col items-start justify-center gap-1">
                                <h1 className="text-xl text-gray-900 font-bold">Usage</h1>
                                <div onClick={() => handleCopyToClipboard(selectedData.snippetData, 'snippet')} className='absolute z-50 right-2 top-10'>
                                    {renderCopyIcon(copied.snippet)}
                                </div>
                                <div className='relative text-sm text-gray-900 border bg-[#212121] border-gray-200 overflow-x-auto hide-scrollbar transition-all flex justify-between items-center w-full rounded-lg'>
                                    <SyntaxHighlighter language="jsx" style={nightOwl}>
                                        {selectedData.snippetData}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex flex-col md:flex-row h-full w-full gap-4">
                            {/* Preview */}
                            <div className="w-full px-4 md:px-0 h-full flex flex-col items-start justify-center gap-1">
                                <h1 className="text-xl text-gray-900 font-bold">Preview</h1>
                                <div className='p-2 w-full h-full text-sm text-gray-900 border bg-white border-gray-200 overflow-y-scroll flex flex-col gap-2 justify-start items-center rounded-lg'>
                                    {/* CardV1 */}
                                    {selectedData.componentName === 'CardV1' && <div className="h-full"> <CardV1 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={false} btn={true} /> </div>}
                                    {selectedData.componentName === 'CardV1' && <div className="h-full"> <CardV1 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={false} /> </div>}
                                    {selectedData.componentName === 'CardV2' && <div className="h-full"> <CardV2 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity.' shadow={false} /> </div>}
                                    {selectedData.componentName === 'CardV3' && <div className="h-full"> <CardV3 title='Speed' featureName="Feature 01" icon={Stalwarts} color="#0f60ff" angle={-5} hoverAngle={-10} description='Instant answers, Greater productivity.' shadow={true} /> </div>}
                                    {selectedData.componentName === 'CardV3' && <div className="h-full"> <CardV3 title='Speed' featureName="Feature 02" icon={Stalwarts} color="#03b333" angle={5} hoverAngle={10} randomness={80} description='Instant answers, Greater productivity.' shadow={true} /> </div>}
                                    {selectedData.componentName === 'CardV3' && <div className="h-full"> <CardV3 title='Speed' featureName="Feature 03" icon={Stalwarts} color="#df9fdf" angle={-5} hoverAngle={-10} randomness={0} description='Instant answers, Greater productivity.' shadow={true} /> </div>}
                                    {selectedData.componentName === 'CardV4' && <div className="h-full"> <CardV4 title='Speed' featureName="Stalwart Group" icon={Stalwarts} description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium ea illo, quasi consequuntur?' shadow={true} /> </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
            <div className="grid responsiveSection">
                {CardData.map((data, index) => (
                    <div
                        key={index}
                        onClick={() => toggleDrawer(data)}
                        className={`cursor-pointer flex w-[300px] h-[225px] md:w-[400px] md:h-[300px] overflow-hidden items-center justify-center border hover:bg-[#fbfbfb] transition-all rounded-2xl`}>
                        {data.componentName === "CardV1" && <div className='scale-[50%] md:scale-[70%] flex justify-center items-center'> <CardV1 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={true} btn={true} /></div>}
                        {data.componentName === "CardV2" && <div className=' scale-[70%] flex justify-center items-center'> <CardV2 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={true} btn={true} /></div>}
                        {data.componentName === "CardV3" && <div className=' scale-[70%] flex justify-center items-center'> <CardV3 title='Speed' featureName="Feature 01" icon={Stalwarts} description='Instant answers, Greater productivity.' shadow={true} /></div>}
                        {data.componentName === "CardV4" && <div className=' scale-[70%] flex justify-center items-center'> <CardV4 title='Speed' featureName="Stalwart Group" icon={Stalwarts} description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium ea illo, quasi consequuntur?' shadow={true} /></div>}
                    </div>
                ))}
            </div>
        </>
    )
}

export default CardPage