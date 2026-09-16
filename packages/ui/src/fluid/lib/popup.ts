export const popupMotionClass =
  "origin-top [--popup-enter-y:-4px] " +
  "data-[side=top]:origin-bottom data-[side=top]:[--popup-enter-y:4px] " +
  "[[data-side=top]_&]:origin-bottom [[data-side=top]_&]:[--popup-enter-y:4px] " +
  "data-[side=left]:origin-right data-[side=left]:[--popup-enter-y:0px] " +
  "[[data-side=left]_&]:origin-right [[data-side=left]_&]:[--popup-enter-y:0px] " +
  "data-[side=right]:origin-left data-[side=right]:[--popup-enter-y:0px] " +
  "[[data-side=right]_&]:origin-left [[data-side=right]_&]:[--popup-enter-y:0px]";

export const popupScrollAreaClass = "min-h-0 flex-1 max-h-[inherit]";
export const popupViewportClass =
  "!h-auto max-h-[inherit] [&>div[style]]:!block [&>div[style]]:!min-w-0 [--scroll-fade-size:32px]";

export const POPUP_NAV_KEYS = [
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Tab",
];

export function isDisabledRow(el: HTMLElement): boolean {
  return el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled");
}
