"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DirectionProvider as BaseDirectionProvider } from "@base-ui/react/direction-provider";

type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction>("ltr");

function DirectionProvider({
  dir,
  children,
  className,
}: {
  dir: Direction;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DirectionContext.Provider value={dir}>
      <BaseDirectionProvider direction={dir}>
        <div dir={dir} className={className}>
          {children}
        </div>
      </BaseDirectionProvider>
    </DirectionContext.Provider>
  );
}

function useDirection(): Direction {
  return useContext(DirectionContext);
}

export { DirectionProvider, useDirection };
export type { Direction };
