import { useRef } from "react";

/**
 * Hook is used to attach mousemove handlers to an element,
 * it will then set two css variables on the element to represent
 * the x and y position of the mouse over the element.
 *
 * Both the x and y position are represented as a number
 * between 0 and 1.
 *
 * Optionally you can pass the boolean `useDistanceFromCenter`
 * which will represent x and y as a number between -1 and 1,
 * useful for animating the element from the center.
 *
 * Hook returns an object with properties that
 * should be spread on the target element.
 */
export const useGetPointerMovement = (useDistanceFromCenter?: boolean) => {
  const boundingRef = useRef<DOMRect | null>(null);

  const props = {
    onMouseLeave: () => (boundingRef.current = null),
    onMouseEnter: (ev: React.MouseEvent<HTMLDivElement>) => {
      boundingRef.current = ev.currentTarget.getBoundingClientRect();
    },
    onMouseMove: (ev: React.MouseEvent<HTMLDivElement>) => {
      if (!boundingRef.current) return;
      const x = ev.clientX - boundingRef.current.left;
      const y = ev.clientY - boundingRef.current.top;
      let xPercentage = x / boundingRef.current.width;
      let yPercentage = y / boundingRef.current.height;

      if (useDistanceFromCenter) {
        xPercentage = (xPercentage - 0.5) * 2;
        yPercentage = (yPercentage - 0.5) * 2;
      }

      ev.currentTarget.style.setProperty("--x", `${xPercentage}`);
      ev.currentTarget.style.setProperty("--y", `${yPercentage}`);
    },
  };

  return props;
};