import React from 'react'
import { useGetPointerMovement } from "../utils/use-get-pointer-movement";

const HomePage = () => {
    const pointerProps = useGetPointerMovement(true);

    return (
        <>
            <div className="relative">
                <div
                    className="absolute top-0 z-10 h-[400px] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#A4A4A3, transparent 50%)' }}
                />
                <svg
                    className="absolute pointer-events-none inset-0 h-full w-full stroke-gray-200  [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
                    aria-hidden
                >
                    <defs>
                        <pattern
                            id="s74rfh-fch9w-0879dst"
                            width={100}
                            height={100}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#s74rfh-fch9w-0879dst)" />
                </svg>
                <div className="max-w-2xl mx-auto text-center py-24">
                    <div className="flex flex-col relative gap-12">
                        <h1 className="text-7xl font-semibold mb-4 relative">Pixa UI</h1>
                        <p className="text-[#5c5c5c] text-xl">A Collection of <span className='font-[500]'>Open Source</span> Components for <span className='border font-[500] rounded-[0.25rem] px-1 bg-[#dedede3f]'>React + TailwindCSS</span> for your Project.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage
