"use client";
import React from "react";
import * as Slider from "@radix-ui/react-slider";

interface SliderComponentProps {
  value: number;
  min: number;
  max: number;
  step: number;
  text: string;
  onValueChange: (value: number[]) => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({
  value,
  min,
  max,
  step,
  text,
  onValueChange,
}) => {
  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor="borderRadiusSlider"
        className="w-[180px] text-sm text-[#212121] dark:text-[#e2e2e2]"
      >
        {text}
      </label>
      <Slider.Root
        className="relative flex w-full items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        orientation="horizontal"
      >
        <Slider.Track className="relative h-8 flex-grow rounded bg-[#f2f2f2] dark:bg-[#212121]">
          <Slider.Range className="absolute left-4 h-full rounded bg-[#a9a9a9] dark:bg-[#515151]" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-8 w-3 cursor-ew-resize rounded-sm bg-[#212121] shadow-lg outline-none dark:bg-white"
          style={{ touchAction: "none" }}
        />
      </Slider.Root>
      <label
        className="ml-2 w-[80px] text-[#212121] dark:text-[#e2e2e2]"
        htmlFor="borderRadiusSlider"
      >
        {value}px
      </label>
    </div>
  );
};

export default SliderComponent;
