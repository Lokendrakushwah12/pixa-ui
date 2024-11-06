"use client";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/pixa-ui/CodeBlock";
import SliderComponent from "@/components/pixa-ui/SliderComponent";
import TableComponent from "@/components/pixa-ui/TableComponent";
import {
  codeData,
  columns,
  data,
  installationData,
} from "@/data/buttons/5/Button";
import Nav from "@/components/pixa-ui/Nav";
import ButtonV5 from "./ButtonV5";

const Page = () => {
  const [borderRadius, setBorderRadius] = useState(10);
  const [textSize, setTextSize] = useState(18);
  const [color, setColor] = useState("#191919");

  const handleSliderChange = (value: number[]) => {
    setBorderRadius(value[0]);
  };

  const handleTextSizeChange = (value: number[]) => {
    setTextSize(value[0]);
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
          <div className="flex h-[230px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-all hover:border-[var(--border-hover)] dark:bg-[#0d0d0d] dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[330px] md:w-full">
              <ButtonV5
                title="ButtonV5"
                borderRadius={`${borderRadius}px`}
                style={{
                  fontSize: `${textSize}px`,
                  backgroundColor: color,
                }}
                className={`border-[#212121] text-white`}
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
          <TableComponent columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};

export default Page;
