"use client";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/pixa-ui/CodeBlock";
import { codeData, data, installationData } from "@/data/modals/1";
import { PropsTable } from "@/components/pixa-ui/PropsTable";
import ResetDialog from "./ResetDialog";
import Nav from "@/components/sections/Nav";

const Page = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReset = () => {
    console.log("Reset action confirmed");
    setDialogOpen(false);
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
            <div className="flex h-[230px] w-full cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-all hover:border-[var(--border-hover)] dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[330px] md:w-full">
              <button
                onClick={() => setDialogOpen(true)}
                className="rounded-xl border border-[var(--border)] bg-[var(--button-secondary)] px-4 py-2 transition-all hover:bg-[var(--button-secondary-hover)]"
              >
                Open Reset Dialog
              </button>
              <ResetDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onReset={handleReset}
              />
            </div>
            <div className="flex h-full w-full flex-col items-start justify-start gap-6 overflow-hidden xs:w-full md:h-[330px] md:w-full">
              <CodeBlock language="bash" value={installationData} />
            </div>
          </div>
          <CodeBlock language="tsx" value={codeData} />
          <PropsTable data={data} />
          {/* <TableComponent columns={columns} data={data} /> */}
        </div>
      </div>
    </>
  );
};

export default Page;
