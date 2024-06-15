import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

import CardV1 from '../Cards/CardV1';
import CardV2 from '../Cards/CardV2';
import CardV3 from '../Cards/CardV3';
import CardV4 from '../Cards/CardV4.jsx';
import Stalwarts from '../../assets/icons/Stalwarts.svg';

const customStyle = {
    ...nightOwl,
    backgroundColor: 'transparent',
    padding: '0.5rem',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.5',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
};


const Sheet = ({ closeSheet, selectedData }) => {
    const [copied, setCopied] = useState({ installation: false, snippet: false });

    const handleClose = (e) => {
        if (e.target.classList.contains('fixed')) {
            closeSheet();
        }
    }

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

    return (
        <div onClick={handleClose} className="fixed backdrop-blur-[8px] inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center transition-all">
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 1000, damping: 100 }}
                className='absolute z-50 bottom-0 border-t left-0 w-full h-3/4 rounded-t-xl px-4 xl:px-8 overflow-auto bg-white p-4 py-2 flex flex-col lg:flex-row gap-2 xl:gap-8 items-start justify-start'
            >
                <div className="flex flex-col h-full w-full justify-start gap-4 items-center">
                    {/* grab handal */}
                    <div className="absolute w-16 h-[5px] bg-gray-300 hover:bg-gray-400/70 transition-all rounded-full top-4 left-1/2 -translate-x-1/2 cursor-grab" onClick={closeSheet} />
                    <div className="flex flex-col md:flex-row h-full w-full gap-4 pt-8">
                        <div className="lg:w-1/2 w-full flex flex-col items-start justify-start gap-4">
                            {/* Install */}
                            <div className="w-full relative flex flex-col items-start justify-center gap-1">
                                <h1 className="text-xl text-gray-900 font-bold">Install the package</h1>
                                <div className='pr-2 text-sm text-gray-900 border bg-[#212121] border-gray-200 overflow-hidden flex justify-between items-center w-full rounded-lg'>
                                    <SyntaxHighlighter className="bg-black" language="bash" style={customStyle}>
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
                                <div className='relative text-sm text-gray-900 border bg-[#212121] border-gray-200  overflow-x-auto hide-scrollbar transition-all flex justify-between items-center w-full rounded-lg'>
                                    <SyntaxHighlighter language="jsx" style={customStyle}>
                                        {selectedData.snippetData}
                                    </SyntaxHighlighter>
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col md:flex-row h-full w-full gap-4">
                            {/* Preview */}
                            <div className="w-full px-4 md:px-0 h-full flex flex-col items-start justify-center gap-1">
                                <h1 className="text-xl text-gray-900 font-bold">Preview</h1>
                                <div className='p-2  h-full text-sm text-gray-900 border bg-white border-gray-200 overflow-y-scroll flex flex-col gap-2 justify-start items-center w-full rounded-lg'>
                                    {/* Button V1 */}
                                    {selectedData.componentName === 'ButtonV1' && <ButtonV1 title='Button' color='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV1' && <ButtonV1 title='Rounded' borderRadius="99px" />}
                                    {selectedData.componentName === 'ButtonV1' && <ButtonV1 title='Borderless' border={false} />}
                                    {/* Button V2 */}
                                    {selectedData.componentName === 'ButtonV2' && <ButtonV2 title="Button" color='#0f6fff' textColor='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV2' && <ButtonV2 title={selectedData.title} color='#fff' background={false} textColor='#212121' />}
                                    {selectedData.componentName === 'ButtonV2' && <ButtonV2 title={selectedData.title} color='#fff' background={false} borderRadius='99px' textColor='#212121' />}
                                    {selectedData.componentName === 'ButtonV2' && <ButtonV2 title={selectedData.title} color='#fff' border={false} background={false} textColor='#212121' />}
                                    {/* Button V3 */}
                                    {selectedData.componentName === 'ButtonV3' && <div className="h-24 flex justify-center items-center"> <ButtonV3 title='Purple Magic' borderRadius="99px" /></div>}
                                    {selectedData.componentName === 'ButtonV3' && <div className="h-24 flex justify-center items-center"> <ButtonV3 title='Blue Magic' borderRadius="99px" color="#0f6fff" /></div>}
                                    {selectedData.componentName === 'ButtonV3' && <div className="h-24 flex justify-center items-center"> <ButtonV3 title='Yellow Magic' borderRadius="99px" color="#f0a000" /></div>}
                                    {/* Button V4 */}
                                    {selectedData.componentName === 'ButtonV4' && <ButtonV4 title='Read More' borderRadius="99px" color="#0f6fff" />}
                                    {/* Button V5 */}
                                    {selectedData.componentName === 'ButtonV5' && <ButtonV5 title='Primary' borderRadius='99px' color='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV5' && <ButtonV5 title='Primary' borderRadius='99px' color='#0f6fff' icon={false} />}
                                    {selectedData.componentName === 'ButtonV5' && <ButtonV5 title='Secondary' borderRadius='99px' color='#f6f8fb' textColor='#212121' />}
                                    {selectedData.componentName === 'ButtonV5' && <ButtonV5 title='Disabled' borderRadius='99px' color='#0f6fff' disabled={true} />}
                                    {selectedData.componentName === 'ButtonV5' && <ButtonV5 title='Destructive' borderRadius='99px' color='#dc271f' />}
                                    {/* Button V6 */}
                                    {selectedData.componentName === 'ButtonV6' && <ButtonV6 title='Button' borderRadius='8px' color='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV6' && <ButtonV6 title='Rounded' borderRadius='99px' color='#212121' />}
                                    {selectedData.componentName === 'ButtonV6' && <ButtonV6 title='Danger' borderRadius='99px' color='#dc271f' />}
                                    {selectedData.componentName === 'ButtonV6' && <ButtonV6 title='Borderless' borderRadius='99px' border={false} txtColor='#d9d9d9' />}
                                    {/* Button V7 */}
                                    {selectedData.componentName === 'ButtonV7' && <ButtonV7 title='Button' color='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV7' && <ButtonV7 title='Rounded' color='#0f6fff' borderRadius='4px' />}
                                    {selectedData.componentName === 'ButtonV7' && <ButtonV7 title='Danger' color='#dc271f' />}
                                    {selectedData.componentName === 'ButtonV7' && <ButtonV7 title='NoEffect' color='#0f6fff' textEffect={false} />}
                                    {/* Button V8 */}
                                    {selectedData.componentName === 'ButtonV8' && <ButtonV8 title='Button' color='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV8' && <ButtonV8 title='Danger' color='#dc271f' />}
                                    {selectedData.componentName === 'ButtonV8' && <ButtonV8 title='NoEffect' color='#0f6fff' textEffect={false} />}
                                    {/* Button V9 */}
                                    {selectedData.componentName === 'ButtonV9' && <ButtonV9 title='Button' color='#0f6fff' />}
                                    {selectedData.componentName === 'ButtonV9' && <ButtonV9 title='Create' color='#03b333' borderRadius='16px' />}
                                    {selectedData.componentName === 'ButtonV9' && <ButtonV9 title='Generate' color='#FF0000' borderRadius='99px' />}

                                    {/* CardV1 */}
                                    {selectedData.componentName === 'CardV1' && <div className="h-full"> <CardV1 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={false} btn={true} /> </div>}
                                    {selectedData.componentName === 'CardV1' && <div className="h-full"> <CardV1 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={false} /> </div>}
                                    {selectedData.componentName === 'CardV2' && <div className="h-full"> <CardV2 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity.' shadow={false} /> </div>}
                                    {selectedData.componentName === 'CardV3' && <div className="h-full"> <CardV3 title='Speed' featureName="Feature 01" icon={Stalwarts} description='Instant answers, Greater productivity.' shadow={true} /> </div>}
                                    {selectedData.componentName === 'CardV4' && <div className="h-full"> <CardV4 title='Speed' featureName="Stalwart Group" icon={Stalwarts} description='Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium ea illo, quasi consequuntur?' shadow={true} /> </div>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Sheet