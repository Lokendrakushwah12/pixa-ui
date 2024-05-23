import React, { useEffect, useState } from 'react'
import CardV1 from '../Components/Cards/CardV1'
import Sheet from '../Components/Current/Sheet';
import { AnimatePresence } from 'framer-motion'
import Stalwarts from '../assets/icons/Stalwarts.svg';

const CardPage = () => {
    const [sheet, setSheet] = useState(false);
    const [CardData, setCardData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);

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
                {CardData.map((data, index) => (
                    <div
                        key={index}
                        onClick={() => openSheet(data)}
                        className={`cursor-pointer flex x-sm:w-[300px] x-sm:h-[225px] w-[400px] h-[300px] overflow-hidden items-center justify-center border hover:bg-[#f9f9f9] transition-all rounded-2xl`}>
                        {data.componentName === "CardV1" && <div className=' scale-[70%] flex justify-center items-center'> <CardV1 title='Speed' logo={Stalwarts} description='Instant answers, Greater productivity, Endless inspiration, Instant productivity, Endless inspiration.' shadow={true} /></div>}
                    </div>
                ))}
            </div>
        </>
    )
}

export default CardPage