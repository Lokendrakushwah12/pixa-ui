import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ButtonV1 from '../Buttons/ButtonV1';
import ButtonV2 from '../Buttons/ButtonV2';


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
                className='cursor-pointer hover:bg-gray-200 p-1 rounded-full transition-all'
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
                className='absolute z-50 bottom-0  border-t left-0 w-full h-3/4 overflow-auto bg-white p-4 flex flex-col gap-2 items-start justify-start'
            >
                <div className="px-4 w-full lg:w-1/2 md:px-2 flex flex-col items-start justify-start gap-1">
                    <h1 className="text-xl text-gray-900 font-bold">Install the package</h1>
                    <div className='p-2 text-sm text-gray-900 border bg-gray-100 border-gray-200 overflow-hidden flex justify-between items-center w-full rounded-lg'>
                        <pre>{selectedData.installationCmd}</pre>
                        <div onClick={() => handleCopyToClipboard(selectedData.installationCmd, 'installation')}>
                            {renderCopyIcon(copied.installation)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row w-full gap-4">
                    {/* Usage 1 */}
                    <div className="w-full relative px-4 md:px-0 sm:px-2 flex flex-col items-start justify-center gap-1">
                        <h1 className="text-xl text-gray-900 font-bold">Usage</h1>
                        <div onClick={() => handleCopyToClipboard(selectedData.snippetData, 'snippet')} className='absolute z-50 right-6 top-10'>
                            {renderCopyIcon(copied.snippet)}
                        </div>
                        <div className='p-4 relative text-sm text-gray-900 border bg-gray-100 border-gray-200  overflow-x-auto hide-scrollbar transition-all flex justify-between items-center w-full rounded-lg'>
                            <pre>{selectedData.snippetData}</pre>
                        </div>
                    </div>
                    {/* Preview */}
                    <div className="w-full px-4 md:px-0 h-[200px] lg:h-full flex flex-col items-start justify-center gap-1">
                        <h1 className="text-xl text-gray-900 font-bold">Preview</h1>
                        <div className='p-2  h-full text-sm text-gray-900 border bg-white border-gray-200 overflow-hidden flex flex-col gap-2 justify-center items-center w-full rounded-lg'>
                            {/* Button V1 */}
                            {selectedData.buttonComponent === 'ButtonV1' && <ButtonV1 title='Button' color='#A020F0' textColor='#f0f0f0' />}
                            {selectedData.buttonComponent === 'ButtonV1' && <ButtonV1 title='Next' color='#A020F0' textColor='#f0f0f0' icon={1} />}
                            {selectedData.buttonComponent === 'ButtonV1' && <ButtonV1 title='Disabled' color='#A020F0' textColor='#f0f0f0' disabled={1} />}
                            {selectedData.buttonComponent === 'ButtonV1' && <ButtonV1 title='Secondary' color='#f6f8fb' textColor='#212121' />}
                            {selectedData.buttonComponent === 'ButtonV1' && <ButtonV1 title='Destructive' color='#dc271f' textColor='#f0f0f0' />}
                            {/* Button V2 */}
                            {selectedData.buttonComponent === 'ButtonV2' && <ButtonV2 title={selectedData.title} color='#8de1a6' textColor='#212121' />}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Sheet