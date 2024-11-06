import React from "react";

const Bg = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#A4A4A3, transparent 50%)",
        }}
      />
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)] dark:stroke-neutral-800"
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
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-neutral-900/50">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#s74rfh-fch9w-0879dst)"
        />
      </svg>
    </>
  );
};

export default Bg;