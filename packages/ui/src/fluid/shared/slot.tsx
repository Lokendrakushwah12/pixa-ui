"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { mergeProps } from "@base-ui/react/merge-props";

interface SlotProps {
  children?: ReactNode;
  [prop: string]: unknown;
}

const Slot = forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  const child = Children.only(children);
  if (!isValidElement(child)) return null;
  const element = child as ReactElement<Record<string, unknown>> & {
    ref?: Ref<HTMLElement>;
  };
  const merged = mergeProps(props, element.props) as Record<string, unknown>;
  return cloneElement(element, { ...merged, ref: ref ?? element.ref });
});

Slot.displayName = "Slot";

export { Slot };
