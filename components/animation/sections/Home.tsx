import React from "react";
import { Button } from "../../ui/Button";
import Bg from "../../ui/Bg";
import { Spotlight } from "../../ui/spotlight";
import Container from "../../animation/container";

const HomeSection = () => {
  return (
    <div className="relative w-full">
      <Bg />
      <Container delay={0.3} className="pointer-events-none absolute z-50">
        <Spotlight
          className="-left-[50%] -top-40 opacity-50 md:-left-[34%] md:-top-[60%]"
          fill="currentColor"
        />
      </Container>
      <div className="my-[1rem] flex h-full flex-col items-center justify-center gap-4 px-3">
        <Container>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h1 className="max-w-lg text-3xl font-bold tracking-tight xs:text-2xl md:max-w-2xl md:text-5xl">
              Curated collection of versatile <br /> React
              <span className="text-xl md:text-3xl">.js</span>/Next
              <span className="text-xl md:text-3xl">.js</span> components
            </h1>
            <p className="text-base font-[300] text-[#777] dark:text-[#777] xs:text-sm md:text-lg">
              Crafted with Tailwind CSS to accelerate your development speed.
            </p>
          </div>
        </Container>
        <Container delay={0.2}>
          <Button variant="secondary">Star on GitHub</Button>
        </Container>
      </div>
    </div>
  );
};

export default HomeSection;
