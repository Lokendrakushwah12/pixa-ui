import React from "react";

const SunBackdrop: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 z-[-1] flex h-full w-full justify-center overflow-hidden filter hue-rotate-[30deg]">
            <div
                className="absolute left-1/2 top-0 h-full w-[calc(100%+300px)] -translate-x-1/2"
                style={{
                    background: `linear-gradient(rgb(242, 237, 234) 100px, rgba(242, 237, 234, 0) 360px),
                      linear-gradient(rgba(57, 48, 246, 0.5) 25%, rgba(30, 45, 211, 0.5) 66%, rgba(112, 23, 255, 0.5) 100%),
                      rgba(217, 217, 217, 0.5)`,
                }}
            />

            {/* <div className="absolute bottom-0 h-[525px] w-[525px] translate-y-[0%] rounded-full bg-[#F45C30] blur-[94px] mix-blend-color-burn md:h-[714px] md:w-[714px]" /> */}

            <div
                className="absolute bottom-0 h-[525px] w-[525px] translate-y-[0%] rounded-full blur-[94px] mix-blend-screen md:h-[714px] md:w-[714px]"
                style={{
                    background: "linear-gradient(180deg, #FFE6C4 0%, #998A76 100%)",
                }}
            />

            <div
                className="absolute bottom-0 h-[525px] w-[525px] translate-y-[0%] rounded-full mix-blend-screen md:h-[714px] md:w-[714px]"
                style={{
                    background: "linear-gradient(180deg, #FFE6C4 0%, #998A7600 50%)",
                }}
            />

            <div className="absolute top-0 left-0 h-full w-full bg-[url('/noise.png')] bg-repeat opacity-70"
            />
        </div>
    );
};

export default SunBackdrop;
