"use client";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/pixa-ui/CodeBlock";
import { codeData, data, installationData } from "@/data/cards/1";
import { PropsTable } from "@/components/pixa-ui/PropsTable";
import Nav from "@/components/sections/Nav";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import StackCard from "./StackCard";

interface Collection {
  id: number;
  title: string;
  images: string[];
}

const collections: Collection[] = [
  {
    id: 1,
    title: "Nature Collection",
    images: [
      "https://images.unsplash.com/photo-1675897974745-1e78e8690755",
      "https://images.unsplash.com/photo-1486718448742-163732cd1544",
      "https://images.unsplash.com/photo-1600669091588-8aaac09509ba",
      "https://images.unsplash.com/photo-1583100913639-b8a172d90b77",
      "https://images.unsplash.com/photo-1583100913828-aeff24cc04ae",
      "https://images.unsplash.com/photo-1583100913639-f3b195f86da2",
    ],
  },
];

const Page = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
            <div className="flex h-[330px] w-full cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[radial-gradient(#40404050_1px,transparent_0)] bg-[length:1rem_1rem] bg-center shadow-[inset_0_0_0_1px_#fff] transition-all hover:border-[var(--border-hover)] dark:shadow-[inset_0_0_0_1px_#0a0a0a] xs:w-full md:h-[330px] md:w-full">
              <MotionConfig reducedMotion="user">
                <div className="relative w-full max-w-6xl p-8">
                  <AnimatePresence>
                    {expandedIndex !== null && (
                      <motion.div
                        className="fixed inset-0 z-40 h-screen w-screen bg-background"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedIndex(null)}
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-40 flex flex-wrap gap-4">
                    {collections.map((collection, index) => (
                      <StackCard
                        key={collection.id}
                        {...collection}
                        index={index}
                        isExpanded={expandedIndex === index}
                        onClick={() =>
                          setExpandedIndex(
                            expandedIndex === index ? null : index,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </MotionConfig>
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
