"use client";

import { cn } from "@/lib/utils";
import type { Transition } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode
} from "react";

// Debug: Let's log what we're importing
console.log("AnimatePresence:", AnimatePresence);
console.log("motion:", motion);

type TabsContextType = {
  value: string;
  setValue: (val: string) => void;
  uniqueId: string;
};

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Must be used within <AnimatedTabs>");
  return context;
}

// Let's simplify and not use compound components for now
export function AnimatedTabs({
  defaultValue,
  onValueChange,
  children,
  className,
  style,
}: {
  defaultValue: string;
  onValueChange?: (val: string) => void;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [value, setValue] = useState(defaultValue);
  const uniqueId = useId();

  const handleChange = (val: string) => {
    setValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value, setValue: handleChange, uniqueId }}>
      <div className={cn("relative", className)} style={style} >{children}</div>
    </TabsContext.Provider>
  );
}

export function AnimatedTabsList({ children, className, style }: { children: ReactNode; className?: string, style?: React.CSSProperties }) {
  return <div className={cn("flex relative", className)} style={style}>{children}</div>;
}

export function AnimatedTabsTrigger({
  value,
  children,
  className,
  style,
  transition = {
    type: 'spring',
    stiffness: 300,
    damping: 22,
  },
}: {
  value: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  transition?: Transition;
}) {
  const { value: active, setValue, uniqueId } = useTabsContext();
  const isActive = active === value;

  return (
    <div
      onClick={() => setValue(value)}
      data-checked={isActive}
      className={cn(
        "relative p-2 cursor-pointer transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            layoutId={`underline-${uniqueId}`}
            className="absolute inset-0 bg-background rounded-lg"
            style={style}
            transition={transition}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </div>
  );
}

export function AnimatedTabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { value: active } = useTabsContext();

  if (active !== value) return null;

  return <div className={cn("mt-[6px]", className)}>{children}</div>;
}