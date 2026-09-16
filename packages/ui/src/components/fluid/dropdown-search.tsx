"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { useSize } from "../../fluid/lib/size-context";
import { useSurface } from "../../fluid/lib/surface-context";
import { SURFACE_BG } from "../../fluid/lib/surface-classes";

interface SearchHandle {
  input: HTMLInputElement | null;
  append: (text: string) => void;
  deleteBackward: () => void;
}

interface DropdownSearchHostValue {
  register: (handle: SearchHandle) => () => void;
  open: boolean;
  highlightFirst: () => void;
}

export const DropdownSearchHostContext =
  createContext<DropdownSearchHostValue | null>(null);

const ROW_SELECTOR = [
  '[role="menuitem"]:not([aria-disabled="true"])',
  '[role="menuitemradio"]:not([aria-disabled="true"])',
  '[role="menuitemcheckbox"]:not([aria-disabled="true"])',
].join(", ");

function menuRows(from: HTMLElement | null): HTMLElement[] {
  const menu = from?.closest<HTMLElement>('[role="menu"]');
  return menu ? Array.from(menu.querySelectorAll<HTMLElement>(ROW_SELECTOR)) : [];
}

interface DropdownSearchHostOptions {
  containerRef: RefObject<HTMLElement | null>;
  setActiveIndex: (index: number | null) => void;
}

export function useDropdownSearchHost(
  open: boolean,
  { containerRef, setActiveIndex }: DropdownSearchHostOptions
) {
  const handleRef = useRef<SearchHandle | null>(null);
  const [searchMounted, setSearchMounted] = useState(false);

  const register = useCallback((handle: SearchHandle) => {
    handleRef.current = handle;
    setSearchMounted(true);
    return () => {
      if (handleRef.current === handle) {
        handleRef.current = null;
        setSearchMounted(false);
      }
    };
  }, []);

  const highlightFirst = useCallback(() => {
    const first = containerRef.current?.querySelector<HTMLElement>(ROW_SELECTOR);
    const index = first?.getAttribute("data-fluid-hover-index");
    setActiveIndex(index != null ? Number(index) : null);
  }, [containerRef, setActiveIndex]);

  const isSearchField = useCallback(
    (target: EventTarget | null) =>
      target !== null && target === handleRef.current?.input,
    []
  );

  const host = useMemo(
    () => ({ register, open, highlightFirst }),
    [register, open, highlightFirst]
  );

  const onKeyDownCapture = useCallback((e: ReactKeyboardEvent<HTMLElement>) => {
    const handle = handleRef.current;
    if (!handle?.input) return;
    if (e.target === handle.input) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1 && e.key !== " ") {
      e.preventDefault();
      e.stopPropagation();
      handle.input.focus();
      handle.append(e.key);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      handle.input.focus();
      handle.deleteBackward();
    }
  }, []);

  const hasSearch = useCallback(() => handleRef.current !== null, []);

  return {
    host,
    hasSearch,
    searchMounted,
    onKeyDownCapture,
    isSearchField,
    highlightFirst,
  };
}

export interface DropdownSearchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "size" | "defaultValue"
  > {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  clearOnClose?: boolean;
  autoFocus?: boolean;
}

const DropdownSearch = forwardRef<HTMLInputElement, DropdownSearchProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Search…",
      clearOnClose = true,
      autoFocus = true,
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const SearchIcon = useIcon("search");
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const host = useContext(DropdownSearchHostContext);
    const open = host?.open ?? true;
    const surface = useSurface();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const valueRef = useRef(value);
    valueRef.current = value;
    const onValueChangeRef = useRef(onValueChange);
    onValueChangeRef.current = onValueChange;
    const clearOnCloseRef = useRef(clearOnClose);
    clearOnCloseRef.current = clearOnClose;

    useEffect(() => {
      if (!host) return;
      return host.register({
        get input() {
          return inputRef.current;
        },
        append: (text) => onValueChangeRef.current(valueRef.current + text),
        deleteBackward: () =>
          onValueChangeRef.current(valueRef.current.slice(0, -1)),
      });
    }, [host]);

    useEffect(() => {
      if (!open) return;
      if (clearOnCloseRef.current && valueRef.current !== "") {
        onValueChangeRef.current("");
      }
      if (!autoFocus) return;
      let inner: number | undefined;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => inputRef.current?.focus());
      });
      return () => {
        cancelAnimationFrame(outer);
        if (inner !== undefined) cancelAnimationFrame(inner);
      };
    }, [open, autoFocus]);

    useEffect(() => {
      if (!host || document.activeElement !== inputRef.current) return;
      host.highlightFirst();
    }, [host, value]);

    useEffect(
      () => () => {
        if (clearOnCloseRef.current && valueRef.current !== "") {
          onValueChangeRef.current("");
        }
      },
      []
    );

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Escape" || e.key === "Tab") return;
      e.stopPropagation();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const rows = menuRows(e.currentTarget);
        if (rows.length === 0) return;
        e.preventDefault();
        (e.key === "ArrowDown" ? rows[0] : rows[rows.length - 1])?.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        menuRows(e.currentTarget)[0]?.click();
      }
    };

    return (
      <div
        className={cn(
          "group/search sticky top-0 z-20 -mx-1 -mt-1 mb-0.5 flex shrink-0 items-center border-b border-border/60",
          SURFACE_BG[surface],
          sizeClasses.control,
          sizeClasses.gap,
          compact ? "px-2.5" : "px-3",
          className
        )}
      >
        <SearchIcon
          size={sizeClasses.icon}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground transition-[color,stroke-width] duration-80 group-focus-within/search:text-foreground group-focus-within/search:stroke-[2]"
        />
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="text"
          role="searchbox"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 rounded-none bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-[inherit]",
            sizeClasses.text,
            compact ? "leading-5" : "leading-6"
          )}
          {...props}
        />
      </div>
    );
  }
);

DropdownSearch.displayName = "DropdownSearch";

const DropdownEmpty = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const sizeClasses = useSize();
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "px-2 py-6 text-center text-muted-foreground",
          sizeClasses.text,
          className
        )}
        {...props}
      />
    );
  }
);

DropdownEmpty.displayName = "DropdownEmpty";

export { DropdownSearch, DropdownEmpty };
