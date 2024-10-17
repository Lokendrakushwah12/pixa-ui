import React from "react";
import { Button } from "../Button/Button";
import Bg from "./Bg";

const HomeSection = () => {
  return (
    <div className="relative w-full">
      <Bg />
      <div className="my-[4rem] flex h-full flex-col items-center justify-center gap-4 px-3">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h1 className="xs:text-2xl max-w-lg text-3xl font-bold tracking-tight md:max-w-2xl md:text-5xl">
            Curated collection of versatile <br /> React
            <span className="text-xl md:text-3xl">.js</span>/Next
            <span className="text-xl md:text-3xl">.js</span> components
          </h1>
          <p className="font-[300] text-[#777] xs:text-sm text-base md:text-lg dark:text-[#777]">
            Crafted with Tailwind CSS to accelerate your development speed.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button>Get Started</Button>
          <Button variant="secondary">Star on GitHub</Button>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
