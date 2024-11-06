"use client";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/pixa-ui/CodeBlock";
import SliderComponent from "@/components/pixa-ui/SliderComponent";
import { codeData, data, installationData } from "@/data/buttons/3/Button";
import Nav from "@/components/pixa-ui/Nav";
import ButtonV3 from "./ButtonV3";
import { PropsTable } from "@/components/pixa-ui/PropsTable";

const Page = () => {
  const [borderRadius, setBorderRadius] = useState(10);
  const [textSize, setTextSize] = useState(18);
  const [padding, setPadding] = useState(12);
  const [color, setColor] = useState("#763afe");

  const handleSliderChange = (value: number[]) => {
    setBorderRadius(value[0]);
  };

  const handleTextSizeChange = (value: number[]) => {
    setTextSize(value[0]);
  };

  const handlePaddingChange = (value: number[]) => {
    setPadding(value[0]);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  return (
    <>
      <Nav />
      <div className="flex w-full items-start justify-center px-8 py-8 xs:px-4 md:px-0">
        <div className="flex w-full max-w-[45rem] flex-col items-start justify-center gap-4">
          <Link href="/" className="flex items-center justify-center">
            <ChevronLeft
              size={18}
              strokeWidth={1.5}
              className="text-[#212121] dark:text-[#e2e2e2]"
            />
            <h4 className="text-[#212121] dark:text-[#e2e2e2]">Back</h4>
          </Link>
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex h-[230px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-all hover:border-[var(--border-hover)] dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[330px] md:w-full">
              <ButtonV3
                title="ButtonV3"
                color={color}
                borderRadius={`${borderRadius}px`}
                style={{
                  fontSize: `${textSize}px`,
                }}
                className=""
                padding={`${padding}px`}
              />
            </div>
            <div className="flex h-full w-full flex-col items-start justify-start gap-6 overflow-hidden xs:w-full md:h-[330px] md:w-full">
              <CodeBlock language="bash" value={installationData} />
              <SliderComponent
                value={borderRadius}
                min={0}
                max={30}
                step={1}
                text="Border Radius:"
                onValueChange={handleSliderChange}
              />
              <SliderComponent
                value={textSize}
                min={10}
                max={30}
                step={1}
                text="Text Size:"
                onValueChange={handleTextSizeChange}
              />
              <SliderComponent
                value={padding}
                min={4}
                max={20}
                step={1}
                text="Padding:"
                onValueChange={handlePaddingChange}
              />
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="svgColor"
                  className="text-sm text-[#212121] dark:text-[#e2e2e2]"
                >
                  Select Icon Color:
                </label>
                <input
                  id="svgColor"
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="m-0 h-8 w-8 cursor-pointer rounded-md border-none p-0 outline-none"
                />
              </div>
            </div>
          </div>
          <CodeBlock language="tsx" value={codeData} />
          <PropsTable data={data} />
        </div>
      </div>
    </>
  );
};

export default Page;
