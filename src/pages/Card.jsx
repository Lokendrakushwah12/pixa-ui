import React from 'react'
import Preview from '../Components/Current/Preview'
import CardV1 from '../Components/Cards/CardV1'
import CardV2 from '../Components/Cards/CardV2'

const Card = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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