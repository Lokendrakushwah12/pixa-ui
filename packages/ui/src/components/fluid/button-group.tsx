"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";

import { cn } from "../../lib/utils";

const ButtonGroupContext = createContext(false);

export function useInButtonGroup(): boolean {
  return useContext(ButtonGroupContext);
}

const ButtonGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <ButtonGroupContext.Provider value={true}>
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex items-center",
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
          "[&>*:not(:first-child)]:-ml-px",
          "[&>*]:relative [&>*:hover]:z-10 [&>*:focus-visible]:z-10 [&>*:focus-within]:z-10 [&>*[data-pressed]]:z-10",
          className
        )}
        {...props}
      />
    </ButtonGroupContext.Provider>
  )
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
export default ButtonGroup;
