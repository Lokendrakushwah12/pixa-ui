import React from 'react'
import ButtonV2 from '../Components/Buttons/ButtonV2'
import ButtonV1 from '../Components/Buttons/ButtonV1'
import Preview from '../Components/Current/Preview'

const Button = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Preview el={<ButtonV1 />} />
                <Preview el={<ButtonV2 />} />
                <Preview el={<ButtonV2 />} />
                <Preview el={<ButtonV2 />} />
                <Preview el={<ButtonV2 />} />
                <Preview el={<ButtonV2 />} />
            </div>
        </>
    )
}

export default Button