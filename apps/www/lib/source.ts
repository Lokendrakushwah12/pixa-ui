import { loader } from "fumadocs-core/source";
import { docs } from "@/.source/server";

export const source = loader({
  baseUrl: "/docs",
  // @ts-expect-error
  source: docs.toFumadocsSource(),
});
