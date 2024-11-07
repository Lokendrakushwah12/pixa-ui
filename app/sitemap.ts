import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [{ url: "https://pixa-ui-dev.vercel.app", lastModified: new Date() }];
}
