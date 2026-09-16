"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { AnimatePresence, motion, Reorder, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { fontWeights } from "../../fluid/lib/font-weight";
import { spring } from "../../fluid/lib/springs";
import { useShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useIcon } from "../../fluid/lib/icon-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";
import { SurfaceProvider } from "../../fluid/lib/surface-context";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import { FileThumbnail } from "../../components/fluid/file-thumbnail";
import { Button } from "../../components/fluid/button";
import { Tooltip } from "../../components/fluid/tooltip";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useRegionHeight() {
  const roRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const ref = useCallback((el: HTMLElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    if (!el) return;
    const sync = () => {
      const next = el.parentElement?.scrollHeight ?? el.offsetHeight;
      if (next > 0) setHeight(next);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    roRef.current = ro;
  }, []);
  return [ref, height] as const;
}

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isTouch;
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,application/pdf";

interface InputMessageSlotContext {
  openFilePicker: (acceptOverride?: string) => void;
  files: File[];
}

type InputMessageSlot =
  | ReactNode
  | ((ctx: InputMessageSlotContext) => ReactNode);

interface QueuedMessage {
  id: string;
  text: string;
  files: File[];
}

interface InputMessageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  size?: SizeVariant;
  value: string;
  onValueChange: (value: string) => void;
  onSend?: (
    value: string,
    files: File[],
    meta?: { queuedId?: string }
  ) => void;
  placeholder?: string;
  leftSlot?: InputMessageSlot;
  rightSlot?: InputMessageSlot;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  clickToFocus?: boolean;
  sendLabel?: string;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  filePreviewSize?: number;
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange" | "onKeyDown" | "disabled" | "placeholder"
  >;
  status?: "idle" | "streaming";
  onStop?: () => void;
  queue?: QueuedMessage[];
  onQueueChange?: (queue: QueuedMessage[]) => void;
  showQueue?: boolean;
  history?: string[];
  placeholderSuggestion?: string;
  suggestions?: string[];
}

interface FilePreviewTileProps {
  file: File;
  onRemove: () => void;
  size: number;
}

function FilePreviewTile({ file, onRemove, size }: FilePreviewTileProps) {
  const XIcon = useIcon("x");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: spring.fast.exit }}
      transition={spring.fast}
      className="relative shrink-0 cursor-default group/tile"
    >
      <FileThumbnail file={file} size={size} />
      <Tooltip content="Remove" side="top">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${file.name}`}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-neutral-900 text-white opacity-0 group-hover/tile:opacity-100 transition-opacity duration-80 flex items-center justify-center cursor-pointer outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]"
        >
          <XIcon size={12} strokeWidth={2.5} />
        </button>
      </Tooltip>
    </motion.div>
  );
}

interface QueuedRowProps {
  item: QueuedMessage;
  index: number;
  total: number;
  reduceMotion: boolean;
  isTouch: boolean;
  onEdit: (item: QueuedMessage) => void;
  onRemove: (item: QueuedMessage) => void;
  onMove: (item: QueuedMessage, dir: -1 | 1) => void;
}

function QueuedRow({
  item,
  index,
  total,
  reduceMotion,
  isTouch,
  onEdit,
  onRemove,
  onMove,
}: QueuedRowProps) {
  const XIcon = useIcon("x");
  const ImageIcon = useIcon("image");
  const compactStep = useSize().variant === "compact";
  const fileCount = item.files.length;
  const label =
    item.text || `${fileCount} attachment${fileCount === 1 ? "" : "s"}`;

  return (
    <Reorder.Item
      value={item}
      layout
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.97, transition: spring.fast.exit }
      }
      transition={spring.fast}
      aria-label={`Queued message ${index + 1} of ${total}: ${label}`}
      tabIndex={0}
      onDoubleClick={() => onEdit(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "F2") {
          e.preventDefault();
          onEdit(item);
        } else if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          onRemove(item);
        } else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
          e.preventDefault();
          onMove(item, e.key === "ArrowUp" ? -1 : 1);
        }
      }}
      className={cn(
        "group/qrow flex items-center gap-2 rounded-lg bg-muted",
        compactStep
          ? "h-7 px-2 text-[12px]"
          : "h-8 px-2.5 text-[13px]",
        "text-foreground/85 select-none outline-none",
        "cursor-grab active:cursor-grabbing",
        "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]"
      )}
      style={{ fontVariationSettings: fontWeights.normal }}
    >
      {fileCount > 0 && (
        <span className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
          <ImageIcon size={13} />
          {item.text && <span className="tabular-nums">{fileCount}</span>}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1">{label}</span>
      <Tooltip content="Remove" side="top">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item);
          }}
          aria-label={`Remove queued message: ${label}`}
          className={cn(
            "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
            "text-muted-foreground hover:text-foreground hover:bg-hover",
            isTouch
              ? "opacity-100"
              : "opacity-0 group-hover/qrow:opacity-100 focus-visible:opacity-100",
            "transition-opacity duration-80 cursor-pointer outline-none",
            "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]"
          )}
        >
          <XIcon size={13} strokeWidth={2.5} />
        </button>
      </Tooltip>
    </Reorder.Item>
  );
}

interface SuggestionRowProps {
  text: string;
  index: number;
  active: boolean;
  keyHint: boolean;
  optionId: string;
  registerItem: (index: number, element: HTMLElement | null) => void;
  onSelect: () => void;
}

function SuggestionRow({
  text,
  index,
  active,
  keyHint,
  optionId,
  registerItem,
  onSelect,
}: SuggestionRowProps) {
  const EnterIcon = useIcon("corner-down-left");
  const ArrowDownIcon = useIcon("arrow-down");
  const compactStep = useSize().variant === "compact";
  const ref = useRef<HTMLDivElement>(null);

  useRegisterFluidHoverItem(registerItem, index, ref);

  return (
    <div
      ref={ref}
      id={optionId}
      role="option"
      aria-selected={active}
      onClick={onSelect}
      className={cn(
        "relative flex cursor-pointer items-center gap-2",
        compactStep ? "h-7 px-2 text-[13px]" : "h-8 px-2.5 text-[14px]",
        "text-muted-foreground transition-colors duration-80",
        active && "text-foreground"
      )}
      style={{ fontVariationSettings: fontWeights.normal }}
    >
      <span className="min-w-0 flex-1 truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1">
        {text}
      </span>
      {!active && keyHint ? (
        <ArrowDownIcon
          size={13}
          className="shrink-0 text-muted-foreground/70 transition-opacity duration-80"
        />
      ) : (
        <EnterIcon
          size={13}
          className={cn(
            "shrink-0 transition-opacity duration-80",
            active ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}

const InputMessage = forwardRef<HTMLDivElement, InputMessageProps>(
  (
    {
      size,
      value,
      onValueChange,
      onSend,
      placeholder = "Ask me anything…",
      leftSlot,
      rightSlot,
      disabled,
      minRows = 1,
      maxRows = 8,
      clickToFocus = true,
      sendLabel = "Send",
      files,
      onFilesChange,
      accept = DEFAULT_ACCEPT,
      maxFiles,
      filePreviewSize = 80,
      textareaProps,
      status,
      onStop,
      queue,
      onQueueChange,
      showQueue = true,
      history = [],
      placeholderSuggestion,
      suggestions,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const shape = useShape();
    const compactStep = useSize(size).variant === "compact";
    const ArrowUpIcon = useIcon("arrow-up");
    const reduceMotion = useReducedMotion() ?? false;
    const isTouch = useIsTouch();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [focusVisible, setFocusVisible] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [hovered, setHovered] = useState(false);

    const {
      onFocus: _textareaOnFocus,
      onBlur: _textareaOnBlur,
      "aria-describedby": textareaDescribedBy,
      ...restTextareaProps
    } = textareaProps ?? {};

    const filesArr = useMemo(() => files ?? [], [files]);
    const supportsFiles = onFilesChange !== undefined;

    const queueArr = useMemo(() => queue ?? [], [queue]);
    const queueRef = useRef(queueArr);
    queueRef.current = queueArr;
    const supportsQueue = status !== undefined && onQueueChange !== undefined;
    const streaming = status === "streaming";
    const [liveMsg, setLiveMsg] = useState("");

    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const draftBeforeHistory = useRef("");

    const suggestionsArr = useMemo(() => suggestions ?? [], [suggestions]);
    const suggestionsOpen = suggestionsArr.length > 0 && value === "";
    const suggestionListRef = useRef<HTMLDivElement>(null);
    const [filesRegionRef, filesRegionHeight] = useRegionHeight();
    const [queueRegionRef, queueRegionHeight] = useRegionHeight();
    const [suggestionsRegionRef, suggestionsRegionHeight] = useRegionHeight();
    const suggestionHover = useFluidHover(suggestionListRef);
    const {
      activeIndex: activeSuggestion,
      setActiveIndex: setActiveSuggestion,
      handlers: suggestionHandlers,
      registerItem: registerSuggestion,
      remeasure,
    } = suggestionHover;

    useEffect(() => {
      if (suggestionsOpen) remeasure();
    }, [suggestionsOpen, remeasure]);
    const suggestionListId = useId();
    const ghostHintId = useId();
    const showGhost =
      !!placeholderSuggestion && value === "" && !(dragOver && supportsFiles);

    useEffect(() => {
      if (!suggestionsOpen) setActiveSuggestion(null);
    }, [suggestionsOpen, setActiveSuggestion]);

    const acceptSuggestion = useCallback(
      (text: string) => {
        setActiveSuggestion(null);
        setHistoryIndex(null);
        onValueChange(text);
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (!el) return;
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        });
      },
      [onValueChange, setActiveSuggestion]
    );

    const lineHeightCache = useRef<{ el: HTMLTextAreaElement; value: number } | null>(null);

    const resizeTextarea = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      let cache = lineHeightCache.current;
      if (!cache || cache.el !== el) {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        cache = { el, value: Number.isNaN(lineHeight) ? 20 : lineHeight };
        lineHeightCache.current = cache;
      }
      const min = cache.value * minRows;
      const max = cache.value * maxRows;
      const next = Math.min(Math.max(el.scrollHeight, min), max);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [minRows, maxRows]);

    useIsoLayoutEffect(() => {
      resizeTextarea();
    }, [value, resizeTextarea]);

    useEffect(() => {
      const el = textareaRef.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      let lastWidth = el.offsetWidth;
      const ro = new ResizeObserver(() => {
        const width = el.offsetWidth;
        if (width === lastWidth) return;
        lastWidth = width;
        resizeTextarea();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [resizeTextarea]);

    const trimmed = value.trim();
    const canSend = !disabled && (trimmed.length > 0 || filesArr.length > 0);

    const EDGE_DROP = "0 1px 1px -0.5px var(--shadow-color)";
    const edgeShadow = dragOver
      ? `0 0 0 1px #6B97FF, ${EDGE_DROP}`
      : focusVisible
        ? `0 0 0 1px color-mix(in oklab, var(--foreground) 20%, transparent), ${EDGE_DROP}`
        : hovered && clickToFocus && !disabled
          ? `0 0 0 1px var(--border), ${EDGE_DROP}`
          : undefined;

    const handleSend = useCallback(() => {
      if (!canSend) return;
      setHistoryIndex(null);
      if (streaming && supportsQueue) {
        const item: QueuedMessage = {
          id: crypto.randomUUID(),
          text: trimmed,
          files: filesArr,
        };
        onQueueChange?.([...queueRef.current, item]);
        onValueChange("");
        if (supportsFiles) onFilesChange?.([]);
        requestAnimationFrame(() => textareaRef.current?.focus());
        return;
      }
      onSend?.(trimmed, filesArr);
    }, [
      canSend,
      streaming,
      supportsQueue,
      onSend,
      trimmed,
      filesArr,
      onQueueChange,
      onValueChange,
      supportsFiles,
      onFilesChange,
    ]);

    const handleStop = useCallback(() => onStop?.(), [onStop]);

    const prevStatusRef = useRef(status);
    useEffect(() => {
      const prev = prevStatusRef.current;
      prevStatusRef.current = status;
      if (!supportsQueue) return;
      if (prev === "streaming" && status === "idle" && queueArr.length > 0) {
        const [next, ...rest] = queueArr as [QueuedMessage, ...QueuedMessage[]];
        onQueueChange?.(rest);
        onSend?.(next.text, next.files, { queuedId: next.id });
        setLiveMsg(
          `Message sent.${rest.length ? ` ${rest.length} still queued.` : ""}`
        );
      }
    }, [status, supportsQueue, queueArr, onQueueChange, onSend]);

    const editQueued = useCallback(
      (item: QueuedMessage) => {
        if (!supportsQueue) return;
        setHistoryIndex(null);
        onValueChange(item.text);
        if (supportsFiles) {
          onFilesChange?.(
            maxFiles != null ? item.files.slice(0, maxFiles) : item.files
          );
        }
        onQueueChange?.(queueRef.current.filter((q) => q.id !== item.id));
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (!el) return;
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        });
      },
      [
        supportsQueue,
        supportsFiles,
        onValueChange,
        onFilesChange,
        maxFiles,
        onQueueChange,
      ]
    );

    const removeQueued = useCallback(
      (item: QueuedMessage) =>
        onQueueChange?.(queueRef.current.filter((q) => q.id !== item.id)),
      [onQueueChange]
    );

    const moveQueued = useCallback(
      (item: QueuedMessage, dir: -1 | 1) => {
        const cur = queueRef.current;
        const i = cur.findIndex((q) => q.id === item.id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= cur.length) return;
        const next = [...cur];
        [next[i], next[j]] = [
          next[j] as QueuedMessage,
          next[i] as QueuedMessage,
        ];
        onQueueChange?.(next);
      },
      [onQueueChange]
    );

    const buttonMode: "send" | "queue" | "stop" = !streaming
      ? "send"
      : canSend && supportsQueue
        ? "queue"
        : onStop
          ? "stop"
          : "send";
    const buttonLabel =
      buttonMode === "stop"
        ? "Stop"
        : buttonMode === "queue"
          ? "Queue message"
          : sendLabel;

    const setCaretEnd = useCallback(() => {
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) el.setSelectionRange(el.value.length, el.value.length);
      });
    }, []);

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent.isComposing) return;

        if (
          suggestionsOpen &&
          !e.shiftKey &&
          !e.altKey &&
          !e.metaKey &&
          !e.ctrlKey
        ) {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestion((prev) =>
              prev == null ? 0 : Math.min(prev + 1, suggestionsArr.length - 1)
            );
            return;
          }
          if (activeSuggestion != null) {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveSuggestion(
                activeSuggestion === 0 ? null : activeSuggestion - 1
              );
              return;
            }
            if (e.key === "Enter") {
              e.preventDefault();
              const picked = suggestionsArr[activeSuggestion];
              if (picked !== undefined) acceptSuggestion(picked);
              return;
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setActiveSuggestion(null);
              return;
            }
          }
        }

        if (
          e.key === "Tab" &&
          !e.shiftKey &&
          placeholderSuggestion &&
          value === ""
        ) {
          e.preventDefault();
          acceptSuggestion(placeholderSuggestion);
          return;
        }

        if (
          history.length > 0 &&
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          !e.shiftKey &&
          !e.altKey &&
          !e.metaKey &&
          !e.ctrlKey
        ) {
          const el = e.currentTarget;
          const caret = el.selectionStart ?? 0;
          const end = el.selectionEnd ?? caret;
          if (e.key === "ArrowUp" && !value.slice(0, caret).includes("\n")) {
            const start = historyIndex == null ? history.length : historyIndex;
            if (start > 0) {
              e.preventDefault();
              if (historyIndex == null) draftBeforeHistory.current = value;
              const ni = start - 1;
              setHistoryIndex(ni);
              onValueChange(history[ni] ?? "");
              setCaretEnd();
            }
            return;
          }
          if (
            e.key === "ArrowDown" &&
            historyIndex != null &&
            !value.slice(end).includes("\n")
          ) {
            e.preventDefault();
            const ni = historyIndex + 1;
            if (ni >= history.length) {
              setHistoryIndex(null);
              onValueChange(draftBeforeHistory.current);
            } else {
              setHistoryIndex(ni);
              onValueChange(history[ni] ?? "");
            }
            setCaretEnd();
            return;
          }
        }

        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [
        history,
        value,
        historyIndex,
        onValueChange,
        setCaretEnd,
        handleSend,
        suggestionsOpen,
        suggestionsArr,
        activeSuggestion,
        setActiveSuggestion,
        acceptSuggestion,
        placeholderSuggestion,
      ]
    );

    const handleContainerMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!clickToFocus || disabled) return;
        const target = e.target as HTMLElement;
        if (target === textareaRef.current) return;
        if (
          target.closest(
            'button, a, input, select, textarea, [contenteditable], [role="button"], [data-im-queue]'
          )
        ) {
          return;
        }
        e.preventDefault();
        textareaRef.current?.focus();
      },
      [clickToFocus, disabled]
    );

    const acceptTokens = useMemo(
      () => accept.split(",").map((s) => s.trim()).filter(Boolean),
      [accept]
    );

    const matchesAccept = useCallback(
      (file: File) =>
        acceptTokens.some((token) => {
          if (token.endsWith("/*")) return file.type.startsWith(token.slice(0, -1));
          if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token.toLowerCase());
          return file.type === token;
        }),
      [acceptTokens]
    );

    const addFiles = useCallback(
      (incoming: File[]) => {
        if (!onFilesChange) return;
        const fingerprint = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
        const existing = new Set(filesArr.map(fingerprint));
        const accepted: File[] = [];
        for (const f of incoming) {
          if (!matchesAccept(f)) continue;
          const fp = fingerprint(f);
          if (existing.has(fp)) continue;
          existing.add(fp);
          accepted.push(f);
        }
        if (!accepted.length) return;
        const next = [...filesArr, ...accepted];
        onFilesChange(maxFiles != null ? next.slice(0, maxFiles) : next);
      },
      [onFilesChange, filesArr, matchesAccept, maxFiles]
    );

    const removeFile = useCallback(
      (idx: number) => {
        if (!onFilesChange) return;
        onFilesChange(filesArr.filter((_, i) => i !== idx));
      },
      [onFilesChange, filesArr]
    );

    const openFilePicker = useCallback(
      (overrideAccept?: string) => {
        const el = fileInputRef.current;
        if (!el) return;
        if (overrideAccept) {
          el.accept = overrideAccept;
          el.click();
          queueMicrotask(() => {
            if (fileInputRef.current) fileInputRef.current.accept = accept;
          });
          return;
        }
        el.click();
      },
      [accept]
    );

    const slotCtx = useMemo<InputMessageSlotContext>(
      () => ({ openFilePicker, files: filesArr }),
      [openFilePicker, filesArr]
    );
    const leftContent =
      typeof leftSlot === "function" ? leftSlot(slotCtx) : leftSlot;
    const rightContent =
      typeof rightSlot === "function" ? rightSlot(slotCtx) : rightSlot;

    const handleDragOver = useCallback(
      (e: ReactDragEvent<HTMLDivElement>) => {
        if (!supportsFiles || disabled) return;
        if (!Array.from(e.dataTransfer.types).includes("Files")) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setDragOver(true);
      },
      [supportsFiles, disabled]
    );

    const handleDragLeave = useCallback(
      (e: ReactDragEvent<HTMLDivElement>) => {
        const wrapper = e.currentTarget;
        const next = e.relatedTarget as Node | null;
        if (next && wrapper.contains(next)) return;
        setDragOver(false);
      },
      []
    );

    const handleDrop = useCallback(
      (e: ReactDragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (!supportsFiles || disabled) return;
        addFiles(Array.from(e.dataTransfer.files));
      },
      [supportsFiles, disabled, addFiles]
    );

    const handleFileInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        addFiles(Array.from(e.target.files));
        e.target.value = "";
      },
      [addFiles]
    );

    const composer = (
      <div
        ref={ref}
        onMouseDown={handleContainerMouseDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col gap-1 p-2 transition-[box-shadow,color] duration-80",
          surfaceClasses(2, 2),
          shape.container,
          clickToFocus && !disabled && "cursor-text",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        style={edgeShadow ? { boxShadow: edgeShadow, ...style } : style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        <SurfaceProvider value={2}>
          {supportsFiles && (
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={maxFiles == null || maxFiles > 1}
              className="hidden"
              onChange={handleFileInputChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          )}

          <AnimatePresence initial={false}>
            {filesArr.length > 0 && (
              <motion.div
                key="preview-row"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: filesRegionHeight ?? 0, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ...spring.moderate, bounce: 0 }}
                className="overflow-hidden"
              >
                <div ref={filesRegionRef} className="flex flex-wrap gap-2 pb-1">
                  <AnimatePresence initial={false} mode="popLayout">
                    {filesArr.map((file, i) => (
                      <FilePreviewTile
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        file={file}
                        onRemove={() => removeFile(i)}
                        size={filePreviewSize}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {supportsQueue && showQueue && (
            <AnimatePresence initial={false}>
              {queueArr.length > 0 && (
                <motion.div
                  key="queue-row"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: queueRegionHeight ?? 0, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ ...spring.moderate, bounce: 0 }}
                  className="overflow-hidden"
                >
                  <Reorder.Group
                    ref={queueRegionRef}
                    axis="y"
                    values={queueArr}
                    onReorder={(next) => onQueueChange?.(next)}
                    data-im-queue
                    className="flex flex-col gap-1 pb-1"
                  >
                    <AnimatePresence initial={false}>
                      {queueArr.map((item, i) => (
                        <QueuedRow
                          key={item.id}
                          item={item}
                          index={i}
                          total={queueArr.length}
                          reduceMotion={reduceMotion}
                          isTouch={isTouch}
                          onEdit={editQueued}
                          onRemove={removeQueued}
                          onMove={moveQueued}
                        />
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setHistoryIndex(null);
                setActiveSuggestion(null);
                onValueChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                if (e.target.matches(":focus-visible")) setFocusVisible(true);
                textareaProps?.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocusVisible(false);
                setActiveSuggestion(null);
                textareaProps?.onBlur?.(e);
              }}
              placeholder={
                dragOver && supportsFiles
                  ? "Drop files here to add to chat"
                  : placeholderSuggestion
                    ? undefined
                    : placeholder
              }
              disabled={disabled}
              rows={minRows}
              aria-label={textareaProps?.["aria-label"] ?? "Message"}
              aria-describedby={
                [showGhost ? ghostHintId : null, textareaDescribedBy]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              aria-activedescendant={
                activeSuggestion != null
                  ? `${suggestionListId}-${activeSuggestion}`
                  : undefined
              }
              className={cn(
                "w-full resize-none rounded-none bg-transparent outline-none",
                "text-foreground placeholder:text-muted-foreground",
                compactStep
                  ? "text-[13px] leading-[18px] px-1.5 py-1.5"
                  : "text-[14px] leading-5 px-2 py-2"
              )}
              style={{ fontVariationSettings: fontWeights.normal }}
              {...restTextareaProps}
            />
            {showGhost && (
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 overflow-hidden text-muted-foreground",
                  compactStep
                    ? "text-[13px] leading-[18px] px-1.5 py-1.5"
                    : "text-[14px] leading-5 px-2 py-2"
                )}
                style={{ fontVariationSettings: fontWeights.normal }}
              >
                <span className="flex max-w-full items-center gap-1.5">
                  <span className="min-w-0 truncate">{placeholderSuggestion}</span>
                  <kbd
                    className={cn(
                      "inline-flex shrink-0 -translate-y-px items-center rounded-[5px] border border-border bg-background px-1 font-sans text-muted-foreground",
                      compactStep ? "h-4 text-[10px]" : "h-[18px] text-[11px]"
                    )}
                  >
                    Tab
                  </kbd>
                </span>
              </div>
            )}
            {showGhost && (
              <span id={ghostHintId} className="sr-only">
                Suggested prompt: {placeholderSuggestion}. Press Tab to fill
                the composer with it.
              </span>
            )}
          </div>
          <div
            className={cn(
              "flex items-center justify-between",
              compactStep
                ? "gap-1.5 [&_button]:h-6 [&_button.w-7]:w-6 [&_button]:text-[11px]"
                : "gap-2"
            )}
          >
            <div className="flex items-center gap-1.5 min-w-0">{leftContent}</div>
            <div className="flex items-center gap-1.5 shrink-0">
              {rightContent}
              <Button
                type="button"
                variant="primary"
                size="icon-sm"
                onClick={buttonMode === "stop" ? handleStop : handleSend}
                disabled={buttonMode === "stop" ? disabled : !canSend}
                aria-label={buttonLabel}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={buttonMode === "stop" ? "stop" : "arrow"}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.6 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.6, transition: spring.fast.exit }
                    }
                    transition={spring.fast}
                    className="flex items-center justify-center leading-none"
                  >
                    {buttonMode === "stop" ? (
                      <span className="h-3 w-3 rounded-[3px] bg-current" />
                    ) : (
                      <ArrowUpIcon
                        size={compactStep ? 15 : 19}
                        className={cn(
                          "block",
                          compactStep
                            ? "!h-[15px] !w-[15px]"
                            : "!h-[19px] !w-[19px]"
                        )}
                      />
                    )}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {suggestionsArr.length > 0 && (
            <AnimatePresence initial={false}>
              {suggestionsOpen && (
                <motion.div
                  key="suggestions"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: suggestionsRegionHeight ?? 0, opacity: 1 }}
                  exit={{ height: 0 }}
                  transition={{ ...spring.moderate, bounce: 0 }}
                  className="-mx-2 -mt-1 overflow-hidden"
                >
                  <div
                    ref={(el) => {
                      suggestionListRef.current = el;
                      suggestionsRegionRef(el);
                    }}
                    role="listbox"
                    id={suggestionListId}
                    aria-label="Suggested prompts"
                    onMouseEnter={suggestionHandlers.onMouseEnter}
                    onMouseMove={suggestionHandlers.onMouseMove}
                    onMouseLeave={suggestionHandlers.onMouseLeave}
                    onClick={suggestionHandlers.onClick}
                    className="relative mt-2 flex flex-col border-t border-border/60 px-1.5 pt-1.5"
                  >
                    <FluidHoverHighlight
                      hover={suggestionHover}
                      className={shape.bg}
                    />
                    {suggestionsArr.map((s, i) => (
                      <SuggestionRow
                        key={`${s}-${i}`}
                        text={s}
                        index={i}
                        active={i === activeSuggestion}
                        keyHint={i === 0 && activeSuggestion == null}
                        optionId={`${suggestionListId}-${i}`}
                        registerItem={registerSuggestion}
                        onSelect={() => acceptSuggestion(s)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <span className="sr-only" role="status" aria-live="polite">
            {liveMsg}
          </span>
        </SurfaceProvider>
      </div>
    );

    return size ? <SizeProvider size={size}>{composer}</SizeProvider> : composer;
  }
);

InputMessage.displayName = "InputMessage";

export { InputMessage };
export type { InputMessageProps, InputMessageSlotContext, QueuedMessage };
export default InputMessage;
