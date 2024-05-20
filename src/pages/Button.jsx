import React, { useEffect, useState } from 'react'
import ButtonV1 from '../Components/Buttons/ButtonV1'
import ButtonV2 from '../Components/Buttons/ButtonV2'
import ButtonV3 from '../Components/Buttons/ButtonV3'
import Sheet from '../Components/Current/Sheet';
import { AnimatePresence } from 'framer-motion'

const Button = () => {
    const [sheet, setSheet] = useState(false);
    const [buttonData, setButtonData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        const fetchButtonData = async () => {
            try {
                const res = await fetch('./Data/buttonData.json');
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setButtonData(data);
            } catch (error) {
                console.error('Fetching error:', error);
            }
        };

        fetchButtonData();
    }, []);

    const closeSheet = (e) => {
        setSheet(false);
        document.body.style.overflow = 'auto';
    }

    const openSheet = (data) => {
        setSelectedData(data);
        setSheet(true);
        document.body.style.overflow = 'hidden';
    }


    return (
        <>
            <AnimatePresence>
                {sheet && <Sheet
                    selectedData={selectedData}
                    closeSheet={closeSheet} />}
            </AnimatePresence>
            <div className="flex flex-wrap gap-4 justify-center items-center w-full max-w[1440px]">
                {buttonData.map((data, index) => (
                    <div
                        key={index}
                        onClick={() => openSheet(data)}
                        className={`cursor-pointer flex x-sm:w-[300px] x-sm:h-[225px] w-[400px] h-[300px] overflow-hidden items-center justify-center border border-[#d0d0d0] rounded-2xl`}>
                        {data.buttonComponent === "ButtonV1" && <ButtonV1 title={data.title} />}
                        {data.buttonComponent === "ButtonV2" && <ButtonV2 title={data.title} />}
                        {data.buttonComponent === "ButtonV3" && <ButtonV3 title={data.title} />}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Button