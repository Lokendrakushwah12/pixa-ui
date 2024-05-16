import React from 'react'

const Preview = ({ el, snippetData, installationCmd }) => {
    const [code, setCode] = React.useState(0);

    let colorSVG = "#b0b0b0";

    const handleCode = () => {
        if (code == 0 || code == 2) {
            setCode(1);
        } else {
            setCode(0);
        }
    };

    const handleCmd = () => {
        if (code == 1 || code == 0) {
            setCode(2);
        } else {
            setCode(0);
        }
    };

    return (
        <>
            <div className="relative">
                <div className="absolute flex justify-center items-center gap-1 cursor-pointer right-4 top-4 ">
                    <div className='flex flex-col gap-2'>
                        <svg onClick={() => { handleCode(); }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.00002 13C8.34002 13.33 7.79002 13.82 7.38002 14.43C7.15002 14.78 7.15002 15.22 7.38002 15.57C7.79002 16.18 8.34002 16.67 9.00002 17" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M15.21 13C15.87 13.33 16.42 13.82 16.83 14.43C17.06 14.78 17.06 15.22 16.83 15.57C16.42 16.18 15.87 16.67 15.21 17" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2.22998 8.01L21.45 8" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg onClick={() => { handleCmd(); }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.88989 9C7.86989 9.49 8.70989 10.23 9.31989 11.15C9.66989 11.67 9.66989 12.34 9.31989 12.86C8.70989 13.77 7.86989 14.51 6.88989 15" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13 15H17" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                </div>
                <div className={`flex w-[400px] h-[300px] overflow-hidden items-center justify-center border border-[#d0d0d0] rounded-2xl`}>
                    {code == 0 && el}
                    {code == 1 && <pre className="text-xs w-full h-full bg-[#121212] text-[#f0f0f0]">{snippetData}</pre>}
                    {code == 2 && <pre className="text-xs w-full h-full bg-[#121212] text-[#f0f0f0] px-4 flex justify-center items-center">
                        <span className='p-2 border border-[#313131] bg-[#212121] flex justify-between items-center w-full rounded-md '>
                            {installationCmd}
                            <svg className='cursor-pointer hover:bg-[#313131] p-1 rounded-full transition-all' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 8.25V18C20 21 18.21 22 16 22H8C5.79 22 4 21 4 18V8.25C4 5 5.79 4.25 8 4.25C8 4.87 8.24997 5.43 8.65997 5.84C9.06997 6.25 9.63 6.5 10.25 6.5H13.75C14.99 6.5 16 5.49 16 4.25C18.21 4.25 20 5 20 8.25Z" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16 4.25C16 5.49 14.99 6.5 13.75 6.5H10.25C9.63 6.5 9.06997 6.25 8.65997 5.84C8.24997 5.43 8 4.87 8 4.25C8 3.01 9.01 2 10.25 2H13.75C14.37 2 14.93 2.25 15.34 2.66C15.75 3.07 16 3.63 16 4.25Z" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8 13H12" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8 17H16" stroke={colorSVG} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </span>
                    </pre>}
                </div>
            </div>
        </>
    )
}

export default Preview