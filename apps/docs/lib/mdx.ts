import fs from "fs";
import path from "path";

import type { Docs } from "@/types/docs";
import matter from "gray-matter";

export interface DocsMdx {
  title: string;
  description: string;
  slug: string;
  icon?: string;
  isNew?: boolean;
  content: string;
  externalDocs?: string;
  externalApi?: string;
}

// Define the structure for meta.json
export interface MetaConfig {
  root: boolean;
  title: string;
  description: string;
  pages: string[];
}

// Function to read and parse meta.json
export function getMetaConfig(docsType: string): MetaConfig | null {
  try {
    const metaPath = path.join(
      process.cwd(),
      "app",
      "_content",
      docsType,
      "meta.json"
    );
    const metaContent = fs.readFileSync(metaPath, "utf8");
    return JSON.parse(metaContent) as MetaConfig;
  } catch (error) {
    console.warn(
      "meta.json not found or invalid, falling back to default grouping", error
    );
    return null;
  }
}

export function getDocsMdx(docsType: string): DocsMdx[] {
  const docsDirectory = path.join(process.cwd(), "app", "_content", docsType);

  // Get all .mdx files
  const files = fs
    .readdirSync(docsDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const docs = files.map((file) => {
    const source = fs.readFileSync(path.join(docsDirectory, file), "utf8");
    const { data: frontmatter, content } = matter(source);

    return {
      title: frontmatter.title || "",
      description: frontmatter.description || "",
      slug: frontmatter.slug || file.replace(/\.mdx$/, ""),
      icon: frontmatter.icon,
      isNew: frontmatter.isNew || false,
      content,
      externalDocs: frontmatter.externalDocs,
      externalApi: frontmatter.externalApi,
    };
  });

  return docs;
}

function readFile(filePath: string): Docs | null {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const slug = path.basename(filePath, path.extname(filePath));

    return {
      ...data,
      slug,
      content,
    } as Docs;
  } catch (error) {
    console.error(`Failed to read or parse the file at ${filePath}:`, error);
    return null;
  }
}

function getFiles(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch (error) {
    console.error(`Failed to read directory at ${dir}:`, error);
    return [];
  }
}

// mdx for ui which is present in app/_content/ui
export function getDocs(directory?: string): Docs[] {
  const files = getFiles(
    path.join(
      process.cwd(),
      "app",
      "_content/ui",
      ...(directory ? [directory] : [])
    )
  );

  return files
    .map((file) =>
      readFile(
        path.join(
          process.cwd(),
          "app",
          "_content/ui",
          ...(directory ? [directory] : []),
          file
        )
      )
    )
    .filter((docs): docs is Docs => docs !== null);
}
