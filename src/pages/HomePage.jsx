import React from 'react'
import { useGetPointerMovement } from "../utils/use-get-pointer-movement";

const HomePage = () => {
    const pointerProps = useGetPointerMovement(true);

    return (
        <>
            <div {...pointerProps} className="relative w-full h-1/2 overflow-hidden">
                <div className="absolute z-40 flex flex-col w-full items-center justify-center h-[300px]">
                    <h1 className="text-[68px] font-bold text-[#212121] text-center mt-8">Pixa UI</h1>
                    <h2 className="text-lg text-[#414141] font-[500] text-center mt-2">A Collection of <span className='font-[600]'>Open Source</span> Components for <span className='border font-[600] shadow border-[#ebebeb42] rounded-[0.25rem] px-1 bg-[#dedede3f]'>React + TailwindCSS</span> for Your Project</h2>
                </div>
                <div className="bg-[#fefefe] w-full h-14 absolute -top-4 z-10 left-1/2 blur-[10px] -translate-x-1/2"></div>
                <div className="bg-[#fefefe] w-full h-20 absolute -bottom-4 z-10 left-1/2 blur-[12px] -translate-x-1/2"></div>
                <div
                    className="circular-fadeout grid h-[400px] w-full place-items-center overflow-clip bg-[#fefefe]"
                >
                    <div
                        className="relative grid place-items-center"
                        role="figure"
                    >
                        <div className="h-[220px] w-[220px] rotate-[var(--gradientRotation,12deg)] rounded-full bg-primary-gradient"></div>
                        <div className="absolute inset-0 -translate-x-[calc(var(--x,0)*10%)] -translate-y-[calc(var(--y,0)*10%)] rotate-[var(--glassRotation,-16deg)] scale-[2] bg-frost bg-[size:var(--glassSectionWidth,20px)] mix-blend-color-dodge backdrop-blur-[var(--blur,20px)]"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage
