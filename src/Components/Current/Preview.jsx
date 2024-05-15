import React from 'react'

const Preview = ({ el }) => {
    return (
        <>
            <div className="flex w-[300px] h-[200px] items-center justify-center border rounded-2xl">
                {el}
            </div>
        </>
    )
}

export default Preview