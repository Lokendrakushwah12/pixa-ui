import { NextResponse } from "next/server";

import { getWwwRoot } from "@/lib/get-www-root";
import { getRegistryItem } from "@/lib/registry";

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name: filename } = await context.params;
  const name = filename.endsWith(".json") ? filename.slice(0, -5) : filename;

  const basePath = getWwwRoot();
  const item = await getRegistryItem(name, basePath);

  if (!item) {
    return NextResponse.json(
      { error: `Registry item "${name}" not found` },
      { status: 404 },
    );
  }

  return NextResponse.json(item, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
