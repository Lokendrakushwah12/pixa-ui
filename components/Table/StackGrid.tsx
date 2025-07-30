"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import Image from "next/image";

interface Collection {
  id: number;
  title: string;
  images: string[];
}

interface StackItemProps {
  images: string[];
  title: string;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
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
  {
    id: 2,
    title: "Architecture",
    images: [
      "https://images.unsplash.com/photo-1674210803712-b75d73df67d1",
      "https://images.unsplash.com/photo-1674207073169-8676749637d3",
      "https://images.unsplash.com/photo-1631125915510-8ffed5a0d054",
      "https://images.unsplash.com/photo-1631125916283-34e834c822cc",
    ],
  },
  {
    id: 3,
    title: "Urban Life",
    images: [
      "https://images.unsplash.com/photo-1682687980115-a37b56ea7271",
      "https://images.unsplash.com/photo-1676780207860-7ab32f87da74",
      "https://images.unsplash.com/photo-1584715787854-9922db91c681",
      "https://images.unsplash.com/photo-1641141264446-9f3e94b15f2c",
      "https://images.unsplash.com/photo-1626105962913-5a53411593e4",
    ],
  },
  {
    id: 4,
    title: "Travel",
    images: [
      "https://images.unsplash.com/photo-1682687980115-a37b56ea7271",
      "https://images.unsplash.com/photo-1676780207860-7ab32f87da74",
      "https://images.unsplash.com/photo-1584715787854-9922db91c681",
      "https://images.unsplash.com/photo-1641141264446-9f3e94b15f2c",
      "https://images.unsplash.com/photo-1626105962913-5a53411593e4",
      "https://images.unsplash.com/photo-1631551976150-097899638e74",
    ],
  },
];

const calculateGridPosition = (
  index: number,
  total: number,
): { x: number; y: number } => {
  const columns = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / columns);
  const col = index % columns;
  return {
    x: col * 260 - ((columns - 1) * 260) / 2,
    y: row * 280 - (Math.floor((total - 1) / columns) * 280) / 2,
  };
};

const StackItem: React.FC<StackItemProps> = ({
  images,
  title,
  isExpanded,
  onClick,
}) => {
  const stackVariants = {
    collapsed: (i: number) => ({
      rotate: i * 4,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.6,
      },
    }),
    expanded: (i: number) => {
      const position = calculateGridPosition(i, images.length);
      return {
        rotate: 0,
        scale: 0.8,
        x: position.x,
        y: position.y,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 0.6,
          delay: i * 0.05,
        },
      };
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex h-[300px] w-[300px] items-center justify-center overflow-visible rounded-lg border border-[var(--border)] bg-[var(--button-secondary)] shadow-lg transition-all hover:border-[var(--border-hover)] hover:bg-[var(--button-secondary-hover)] ${
        isExpanded ? "z-[60]" : ""
      }`}
      transition={{ type: "spring", bounce: 0.3 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={`fixed inset-0 z-50 h-screen w-screen bg-background transition-all ${isExpanded ? "z-[-10]" : ""} `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className={`relative flex h-full w-full items-center justify-center`}
        animate={{ height: isExpanded ? "400px" : "300px" }}
      >
        <AnimatePresence>
          {images.map((image, imgIndex) => (
            <motion.div
              key={imgIndex}
              className="absolute inset-[12.5%] h-full w-full"
              custom={imgIndex}
              variants={stackVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              style={{
                zIndex: images.length - imgIndex,
                transformOrigin: "center center",
              }}
            >
              <div
                className={`p-2 transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100"
                    : imgIndex === 0
                      ? "opacity-100"
                      : "opacity-90"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  width={isExpanded ? 600 : 200}
                  height={isExpanded ? 400 : 200}
                  className={`rounded-lg object-cover shadow-lg transition-all duration-300 ${
                    isExpanded ? "h-[300px] w-[300px]" : "h-[200px] w-[200px]"
                  }`}
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <motion.span
        className={`absolute w-full text-center text-foreground transition-all duration-300 ${
          isExpanded ? "-top-1/2 ml-[25%] text-2xl" : "bottom-0 text-base"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      >
        {title}
      </motion.span>
    </motion.button>
  );
};

const StackGrid: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative  w-full max-w-6xl p-8">
        <AnimatePresence>
          {expandedIndex !== null && (
            <motion.div
              className="fixed inset-0 z-50 h-screen w-screen bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedIndex(null)}
            />
          )}
        </AnimatePresence>
        <div className="relative z-50 flex flex-wrap gap-4">
          {collections.map((collection, index) => (
            <StackItem
              key={collection.id}
              {...collection}
              index={index}
              isExpanded={expandedIndex === index}
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </MotionConfig>
  );
};

export default StackGrid;
