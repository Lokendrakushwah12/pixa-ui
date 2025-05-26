"use client";
import { AnimatedTabs } from "@/components/core/animated-tabs";
import CodeBlock from "@/components/pixa-ui/CodeBlock";
import { PropsTable } from "@/components/pixa-ui/PropsTable";
import SliderComponent from "@/components/pixa-ui/SliderComponent";
import { AnimatedListPropsdata, AnimatedTabsContentProps, AnimatedTabsProps, AnimatedTabsTriggerProps, codeData, installationData } from "@/data/tabs/1";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [borderRadius, setBorderRadius] = useState(16);
  const [Color, setColor] = useState("#0dad8d");

  const handleSliderChange = (value: number[]) => {
    setBorderRadius(value[0]);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  return (
    <>
      <div className="flex w-full items-start justify-center px-8 py-8 xs:px-4 md:px-0">
        <div className="flex w-full max-w-[45rem] flex-col items-start justify-center gap-4">
          <Link href="/" className="flex items-center justify-center">
            <ChevronLeft
              size={18}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
            <h4 className="text-muted-foreground">Back</h4>
          </Link>
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex h-[230px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-all hover:border-muted-foreground/25 dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[330px] md:w-full">
              <AnimatedTabs
                defaultValue="tab1"
                className={`w-[300px] bg-muted-foreground/10 p-1`}
                style={{
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <AnimatedTabs.List className="w-full bg-black p-1 rounded-xl"
                  style={{
                    borderRadius: `${borderRadius - 4}px`,
                  }}>
                  <AnimatedTabs.Trigger
                    value="tab1"
                    className="w-full text-center text-sm"
                    style={{
                      borderRadius: `${borderRadius - 8}px`,
                      backgroundColor: Color || "transparent",
                    }}
                  >
                    Tab 1
                  </AnimatedTabs.Trigger>
                  <AnimatedTabs.Trigger
                    value="tab2"
                    className="w-full text-center text-sm"
                    style={{
                      borderRadius: `${borderRadius - 8}px`,
                      backgroundColor: Color || "transparent",
                    }}
                  >
                    Tab 2
                  </AnimatedTabs.Trigger>
                </AnimatedTabs.List>

                <AnimatedTabs.Content value="tab1">
                  <p className="text-sm text-muted-foreground px-2">This is the content for Tab 1.</p>
                </AnimatedTabs.Content>
                <AnimatedTabs.Content value="tab2">
                  <p className="text-sm text-muted-foreground px-2">This is the content for Tab 2.</p>
                </AnimatedTabs.Content>
              </AnimatedTabs>
            </div>
            <div className="flex h-full w-full flex-col items-start justify-start gap-6 overflow-hidden xs:w-full md:h-[330px] md:w-full">
              <CodeBlock language="bash" value={installationData} />
              <SliderComponent
                value={borderRadius}
                min={0}
                max={20}
                step={1}
                text="Border Radius:"
                onValueChange={handleSliderChange}
              />
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="Color"
                  className="text-sm text-[#212121] dark:text-[#e2e2e2]"
                >
                  Select Color:
                </label>
                <input
                  id="Color"
                  type="color"
                  value={Color}
                  onChange={handleColorChange}
                  className="m-0 h-8 w-8 cursor-pointer rounded-md border-none p-0 outline-none"
                />
              </div>
            </div>
          </div>
          <CodeBlock language="tsx" value={codeData} />
          <h2 className="text-lg font-semibold mt-6">Props</h2>
          <p className="text-sm text-muted-foreground -mb-5">
            The following props are available for the <code>&lt;AnimatedTabs /&gt;</code> component.
          </p>
          <PropsTable data={AnimatedTabsProps} />

          <h2 className="text-lg font-semibold mt-6">Subcomponents</h2>
          <p className="text-sm text-muted-foreground -mb-5">
            The <code>&lt;AnimatedTabs /&gt;</code> component includes several subcomponents for customization.
          </p>

          <h3 className="text-md font-medium text-muted-foreground mt-6 mb-1">
            &lt;AnimatedTabs.List /&gt;
          </h3>
          <p className="text-sm text-muted-foreground -mb-5">
            Used to group tab triggers. Can be styled to control tab layout and behavior.
          </p>
          <PropsTable data={AnimatedListPropsdata} />

          <h3 className="text-md font-medium text-muted-foreground mt-6 mb-1">
            &lt;AnimatedTabs.Trigger /&gt;
          </h3>
          <p className="text-sm text-muted-foreground -mb-5">
            Represents an individual tab button. Accepts a <code>value</code> that matches the content&apos;s value.
          </p>
          <PropsTable data={AnimatedTabsTriggerProps} />

          <h3 className="text-md font-medium text-muted-foreground mt-6 mb-1">
            &lt;AnimatedTabs.Content /&gt;
          </h3>
          <p className="text-sm text-muted-foreground -mb-5">
            Defines the content for a tab. It must have a <code>value</code> prop matching a corresponding trigger.
          </p>
          <PropsTable data={AnimatedTabsContentProps} />

        </div>
      </div>
    </>
  );
};

export default Page;
