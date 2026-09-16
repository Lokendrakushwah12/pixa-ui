export const bevel = [
  "not-disabled:border-t-[color-mix(in_oklab,var(--color-white)_16%,var(--border))]",
  "[&:is(:active,[data-pressed])]:border-t-[color-mix(in_oklab,var(--color-black)_8%,var(--border))]",
].join(" ");

export const buttonLiftReset =
  "[&:is(:disabled,:active,[data-pressed])]:shadow-none";

export const buttonLiftShadow = "0_1px_2px_rgb(0_0_0_/_0.08)";
