"use client";

import { useMemo } from "react";

import { FileThumbnail } from "@/registry/default/ui/file-thumbnail";

export default function Particle() {
  const files = useMemo(
    () => [
      new File(["id,name\n1,Ada\n"], "contacts.csv", { type: "text/csv" }),
      new File(["{}"], "tokens.json", { type: "application/json" }),
      new File(["# Notes"], "README.md", { type: "text/markdown" }),
    ],
    [],
  );

  return (
    <div className="flex items-center gap-3">
      {files.map((file) => (
        <FileThumbnail file={file} key={file.name} size={56} />
      ))}
    </div>
  );
}
