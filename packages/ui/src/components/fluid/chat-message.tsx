"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useShape } from "../../fluid/lib/shape-context";
import { useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useTouchPrimary } from "../../fluid/hooks/use-touch-primary";
import { FileThumbnail } from "../../components/fluid/file-thumbnail";

interface ChatMessageProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  from: "user" | "assistant";
  files?: File[];
  thumbnailSize?: number;
  time?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  size?: SizeVariant;
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    { from, files, thumbnailSize = 64, time, actions, children, size, className, ...props },
    ref
  ) => {
    const shape = useShape();
    const compact = useSize(size).variant === "compact";
    const isUser = from === "user";
    const isTouch = useTouchPrimary();
    const showTime = isUser && time != null;

    return (
      <motion.div
        ref={ref}
        layout="position"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring.moderate}
        style={{ transformOrigin: isUser ? "bottom right" : "bottom left" }}
        className={cn(
          "group flex max-w-[80%] flex-col gap-1.5",
          isUser ? "items-end self-end" : "items-start self-start",
          className
        )}
        {...props}
      >
        {files && files.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-1.5",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {files.map((file, i) => (
              <FileThumbnail
                key={`${file.name}-${file.size}-${file.lastModified}-${i}`}
                file={file}
                size={thumbnailSize}
              />
            ))}
          </div>
        )}
        {children != null && children !== "" && (
          <div
            className={cn(
              "whitespace-pre-wrap break-words",
              compact ? "py-1.5 text-[13px]" : "py-2 text-[14px]",
              isUser
                ? cn(
                    shape.bg,
                    compact ? "px-3" : "px-3.5",
                    "text-pretty bg-[color-mix(in_oklab,var(--accent),var(--background)_45%)] text-accent-foreground"
                  )
                : "text-foreground"
            )}
          >
            {children}
          </div>
        )}
        {(showTime || actions != null) && (
          <div
            className={cn(
              "flex items-center gap-2 px-1 leading-none text-muted-foreground select-none",
              compact ? "text-[11px]" : "text-[12px]",
              !isTouch && [
                "opacity-0 pointer-events-none transition-opacity duration-150",
                "group-hover:opacity-100 group-hover:pointer-events-auto",
                "group-focus-within:opacity-100 group-focus-within:pointer-events-auto",
              ]
            )}
          >
            {showTime && <span className="tabular-nums">{time}</span>}
            {actions != null && (
              <span className="flex items-center gap-0.5">{actions}</span>
            )}
          </div>
        )}
      </motion.div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

export { ChatMessage };
export type { ChatMessageProps };
export default ChatMessage;
