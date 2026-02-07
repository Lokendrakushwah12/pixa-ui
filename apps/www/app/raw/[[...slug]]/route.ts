import fs from "node:fs/promises";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

import { getWwwRoot } from "@/lib/get-www-root";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const basePath = getWwwRoot();
  const contentDir = path.join(basePath, "content");

  // Map URL segments to filesystem: "docs" -> "(root)", else use segment as-is
  let filePath: string;
  if (slug[0] === "docs" && slug.length >= 2) {
    filePath = path.join(contentDir, "(root)", slug[1] ?? "");
  } else {
    filePath = path.join(contentDir, ...slug);
  }

  // Resolve and ensure we don't escape content dir (path traversal)
  const resolved = path.resolve(filePath);
  const contentDirResolved = path.resolve(contentDir);
  if (!resolved.startsWith(contentDirResolved)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const withMdx = filePath.endsWith(".mdx")
    ? filePath
    : filePath.endsWith(".md")
      ? filePath
      : `${filePath}.mdx`;
  const withMd = filePath.endsWith(".md") ? filePath : `${filePath}.md`;

  try {
    let content: string;
    try {
      content = await fs.readFile(withMdx, "utf-8");
    } catch {
      content = await fs.readFile(withMd, "utf-8");
    }

    return new NextResponse(content, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
