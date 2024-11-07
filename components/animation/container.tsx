"use client";

import { cn } from "@/functions/cn";
import { motion } from "framer-motion";

interface Props {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  reverse?: boolean;
  simple?: boolean;
}

const Container = ({
  children,
  className,
  delay = 0.2,
  reverse,
  simple,
}: Props) => {
  return (
    <motion.div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        delay: delay,
        duration: simple ? 0.2 : 0.4,
        type: simple ? "keyframes" : "spring",
        stiffness: simple && 100,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Container;
