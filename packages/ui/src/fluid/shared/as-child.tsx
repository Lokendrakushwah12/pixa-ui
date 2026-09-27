"use client";

import { isValidElement, type ComponentType, type ReactElement } from "react";

/**
 * Restores the `asChild` spelling on a Base UI part.
 *
 * These components came from Radix, where `asChild` took the single child as
 * the rendered element. Base UI spells that `render`, so without this every
 * `asChild` call site would have to change.
 */
export function withAsChild<P extends { render?: unknown; children?: unknown }>(
  Part: ComponentType<P>,
  displayName: string
) {
  function WithAsChild({
    asChild,
    children,
    ...props
  }: P & { asChild?: boolean }) {
    if (asChild && isValidElement(children)) {
      return <Part {...(props as P)} render={children as ReactElement} />;
    }
    return (
      <Part {...(props as P)} render={(props as P).render}>
        {children as never}
      </Part>
    );
  }
  WithAsChild.displayName = displayName;
  return WithAsChild;
}
