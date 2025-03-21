"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    id: 1,
    image:
      "https://assets.lummi.ai/assets/QmSvARYf4xpDZSZHu82DhuHLMiunzsSNzsSyTZto7H691W?auto=format&w=1500",
    description: "New AI-Powered Features",
  },
  {
    id: 2,
    image:
      "https://assets.lummi.ai/assets/QmTzN9YhtsUdmQXXe8p8w4FCsbK2bdBqXUGVuaqePecDwu?auto=format&w=1500",
    description: "Advanced Data Visualization",
  },
  {
    id: 3,
    image:
      "https://assets.lummi.ai/assets/QmWuo12YhRPYcxdb8oPVBreMnr7nQrb7tx4stPrenoG1Qt?auto=format&w=1500",
    description: "Enhanced Collaboration Tools",
  },
  {
    id: 4,
    image:
      "https://assets.lummi.ai/assets/QmdHyfNc8Su5zMugjKHWgAqgRT1unRkfxCbS8Jvj1bz8dm?auto=format&w=1500",
    description: "Performance Optimization",
  },
  {
    id: 5,
    image:
      "https://assets.lummi.ai/assets/QmVmJhAZCm4NYLjnCAmuVnm4ykpE6vwrk4xGaRp8DdLL9f?auto=format&w=1500",
    description: "Custom Workflow Builder",
  },
  {
    id: 6,
    image:
      "https://assets.lummi.ai/assets/QmSvARYf4xpDZSZHu82DhuHLMiunzsSNzsSyTZto7H691W?auto=format&w=1500",
    description: "New AI-Powered Features",
  },
  {
    id: 7,
    image:
      "https://assets.lummi.ai/assets/QmTzN9YhtsUdmQXXe8p8w4FCsbK2bdBqXUGVuaqePecDwu?auto=format&w=1500",
    description: "Advanced Data Visualization",
  },
  {
    id: 8,
    image:
      "https://assets.lummi.ai/assets/QmWuo12YhRPYcxdb8oPVBreMnr7nQrb7tx4stPrenoG1Qt?auto=format&w=1500",
    description: "Enhanced Collaboration Tools",
  },
  {
    id: 9,
    image:
      "https://assets.lummi.ai/assets/QmdHyfNc8Su5zMugjKHWgAqgRT1unRkfxCbS8Jvj1bz8dm?auto=format&w=1500",
    description: "Performance Optimization",
  },
  {
    id: 10,
    image:
      "https://assets.lummi.ai/assets/QmVmJhAZCm4NYLjnCAmuVnm4ykpE6vwrk4xGaRp8DdLL9f?auto=format&w=1500",
    description: "Custom Workflow Builder",
  },
];

const page = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const gridItems = gridRef.current.querySelectorAll(".grid-item");

    gridItems.forEach((item, i) => {
      const depth = 500; // Increased depth for more pronounced 3D effect
      const stagger = 0.05; // Stagger the animations

      gsap.set(item, {
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: "top bottom+=10%",
            end: "bottom top-=25%",
            scrub: true,
            markers: false,
          },
        })
        .fromTo(
          item,
          {
            // filter: "blur(7px) brightness(0%) contrast(400%)", // Initial filter for entry
            z: depth,
            rotationX: 60,
            // y: 200,
          },
          {
            // filter: "blur(0px) brightness(100%) contrast(100%)", // Clear filter on entry completion
            z: 0,
            rotationX: 0,
            y: 0,
            scale: 1,
            duration: 2,
            ease: "sine",
            // delay: stagger,
          },
        )
        .to(item, {
          // filter: "blur(7px) brightness(0%) contrast(100%)", // Apply filter for exit
          z: depth,
          rotationX: -60,
          // y: -200,
          duration: 2,
          ease: "sine",
        });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black py-40"
    >
      <div ref={gridRef} className="mx-auto grid max-w-7xl gap-y-12 px-4">
        {images.map((item, index) => (
          <div
            key={item.id}
            className={`grid-item relative mx-auto w-full max-w-3xl transform-gpu place-items-center transition-transform duration-700 ease-out ${index % 2 === 0 ? "justify-self-start" : "justify-self-end"}`}
          >
            <div className="group relative h-[180px] w-[180px] overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
              <div className="aspect-[1/1] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.description}
                  className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-xl font-bold">{item.description}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
