import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  // Every route is force-static / revalidate:false, so there is nothing to
  // render at request time. Export it and serve pure static assets.
  output: "export",
  reactStrictMode: true,
};

const withMDX = createMDX({
  // customise the config file path
  // configPath: "source.config.ts"
});

export default withMDX(config);
