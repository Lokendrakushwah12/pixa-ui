"use client";

import { type HTMLAttributes } from "react";

import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";
import { FileThumbnail } from "../../components/fluid/file-thumbnail";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

interface AttachmentProps extends HTMLAttributes<HTMLDivElement> {
  file: File;
  onRemove?: () => void;
  progress?: number;
  error?: string;
}

function Attachment({
  file,
  onRemove,
  progress,
  error,
  className,
  ...props
}: AttachmentProps) {
  const XIcon = useIcon("x");
  const shape = useShape();
  const uploading = progress !== undefined && progress < 100;

  return (
    <div
      data-slot="attachment"
      className={cn(
        "flex items-center gap-2.5 border border-border p-2",
        error && "border-destructive/40",
        shape.container,
        className
      )}
      {...props}
    >
      <FileThumbnail file={file} size={32} />

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
        {error ? (
          <p className="text-[11px] text-destructive">{error}</p>
        ) : uploading ? (
          <p className="text-[11px] text-muted-foreground tabular-nums">
            {Math.round(progress!)}% of {formatBytes(file.size)}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
        )}
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className={cn(
            "ml-auto shrink-0 rounded-md p-1 text-muted-foreground",
            "transition-colors duration-100 hover:text-foreground",
            "outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "[&>svg]:size-3.5"
          )}
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}

function AttachmentList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export { Attachment, AttachmentList, formatBytes };
export type { AttachmentProps };
