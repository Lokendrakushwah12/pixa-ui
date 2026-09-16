"use client";

import { useState } from "react";
import { MagneticDropzone } from "@/registry/default/ui/magnetic-dropzone";

export default function Particle() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <div className="w-full max-w-sm">
        <MagneticDropzone onFiles={(f) => setFiles(f)} />
      </div>
      <div className="w-full max-w-sm">
        <MagneticDropzone accept="image/*" onFiles={(f) => setFiles(f)} />
      </div>
      {files.length > 0 && (
        <span className="text-[12px] text-muted-foreground">
          {files.map((f) => f.name).join(", ")}
        </span>
      )}
    </>
  );
}
