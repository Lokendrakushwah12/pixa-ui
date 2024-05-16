import React from 'react'
import Preview from '../Components/Current/Preview'
import CardV1 from '../Components/Cards/CardV1'
import CardV2 from '../Components/Cards/CardV2'

const Card = () => {
    return (
        <>
            <div className="flex flex-wrap gap-4 justify-center items-center w-full max-w[1440px] h-screen">
                <Preview el={<CardV1 />} />
                <Preview el={<CardV2 />} />
                <Preview el={<CardV2 />} />
                <Preview el={<CardV2 />} />
                <Preview el={<CardV2 />} />
                <Preview el={<CardV2 />} />
            </div>
        </>
    )
}

export default Card