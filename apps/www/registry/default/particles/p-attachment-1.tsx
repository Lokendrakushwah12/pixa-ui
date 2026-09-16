"use client";

import { useState } from "react";
import { Attachment, AttachmentList } from "@/registry/default/ui/attachment";
import { MagneticDropzone } from "@/registry/default/ui/magnetic-dropzone";

type Dropped = { id: string; file: File };

export default function Particle() {
  const [items, setItems] = useState<Dropped[]>([]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <MagneticDropzone
        onFiles={(f) =>
          setItems((prev) => [
            ...prev,
            ...f.map((file) => ({ file, id: crypto.randomUUID() })),
          ])
        }
      />
      {items.length > 0 && (
        <AttachmentList>
          {items.map((item) => (
            <Attachment
              file={item.file}
              key={item.id}
              onRemove={() =>
                setItems((prev) => prev.filter((p) => p.id !== item.id))
              }
            />
          ))}
        </AttachmentList>
      )}
    </div>
  );
}
