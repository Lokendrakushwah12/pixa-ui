import { loader } from "fumadocs-core/source";
import { docs } from "@/.source/server";

const docsWithSource = docs as {
  toFumadocsSource: () => Parameters<typeof loader>[0]["source"];
};
export const source = loader({
  baseUrl: "/docs",
  source: docsWithSource.toFumadocsSource(),
});
