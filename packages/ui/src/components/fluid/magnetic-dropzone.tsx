"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";

const MAX_LEAN = 6;

interface MagneticDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

function MagneticDropzone({
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  className,
  children,
}: MagneticDropzoneProps) {
  const UploadIcon = useIcon("plus");
  const shape = useShape();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const depth = useRef(0);

  const [over, setOver] = useState(false);
  const [lean, setLean] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const swallow = (e: globalThis.DragEvent) => e.preventDefault();
    window.addEventListener("dragover", swallow);
    window.addEventListener("drop", swallow);
    return () => {
      window.removeEventListener("dragover", swallow);
      window.removeEventListener("drop", swallow);
    };
  }, []);

  const matches = useCallback(
    (file: File) => {
      if (!accept) return true;
      return accept.split(",").some((rule) => {
        const r = rule.trim();
        if (!r) return false;
        if (r.startsWith(".")) return file.name.toLowerCase().endsWith(r.toLowerCase());
        if (r.endsWith("/*")) return file.type.startsWith(r.slice(0, -1));
        return file.type === r;
      });
    },
    [accept]
  );

  const reset = () => {
    depth.current = 0;
    setOver(false);
    setLean({ x: 0, y: 0 });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled || reduceMotion) return;
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const dx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (e.clientY - (box.top + box.height / 2)) / (box.height / 2);
    setLean({ x: dx * MAX_LEAN, y: dy * MAX_LEAN });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    reset();
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files).filter(matches);
    if (dropped.length) onFiles(multiple ? dropped : dropped.slice(0, 1));
  };

  return (
    <motion.div
      ref={ref}
      data-slot="magnetic-dropzone"
      animate={over ? { x: lean.x, y: lean.y, scale: 1.01 } : { x: 0, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : spring.moderate}
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current += 1;
        if (!disabled) setOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        depth.current -= 1;
        if (depth.current <= 0) reset();
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-2",
        "border-2 border-dashed p-8 text-center transition-colors duration-100",
        over ? "border-ring bg-accent/40" : "border-border",
        disabled && "pointer-events-none opacity-50",
        shape.container,
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []).filter(matches);
          if (picked.length) onFiles(picked);
          e.target.value = "";
        }}
      />

      {children ?? (
        <>
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-4">
            <UploadIcon />
          </span>
          <p className="text-[13px] font-medium text-foreground">
            {over ? "Drop to attach" : "Drag files here"}
          </p>
          <p className="text-[12px] text-muted-foreground">or click to browse</p>
        </>
      )}
    </motion.div>
  );
}

export { MagneticDropzone };
export type { MagneticDropzoneProps };
