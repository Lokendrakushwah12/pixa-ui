export default {
  "**/*.{js,ts,jsx,tsx,md,mdx,json}": () => [
    "pnpm exec biome check --write --no-errors-on-unmatched",
  ],
};
