"use client";

import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useIcon, type IconComponent } from "../../fluid/lib/icon-context";
import { usePopupShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { isDisabledRow } from "../../fluid/lib/popup";
import {
  useFluidHover,
  useRegisterFluidHoverItem,
  type UseFluidHoverReturn,
} from "../../fluid/hooks/use-fluid-hover";
import { ScrollArea } from "../../components/fluid/scroll-area";
import {
  FluidHoverHighlight,
  type FluidHoverSource,
} from "../../fluid/shared/fluid-hover-highlight";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../components/fluid/dialog";
import { TabsSubtle, TabsSubtleItem } from "../../components/fluid/tabs-subtle";

export interface CommandMenuItemData {
  value: string;
  label: string;
  action?: string;
  description?: string;
  icon?: IconComponent;
  shortcut?: string;
  keywords?: readonly string[];
  group?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

interface CommandMenuSection {
  id: string;
  heading: string | null;
  items: CommandMenuItemData[];
  start: number;
}

export interface ParsedShortcut {
  mod: boolean;
  meta: boolean;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

const MODIFIER_TOKENS: Record<string, keyof Omit<ParsedShortcut, "key">> = {
  mod: "mod",
  cmd: "meta",
  command: "meta",
  meta: "meta",
  win: "meta",
  super: "meta",
  ctrl: "ctrl",
  control: "ctrl",
  alt: "alt",
  option: "alt",
  opt: "alt",
  shift: "shift",
};

const KEY_ALIASES: Record<string, string> = {
  esc: "escape",
  return: "enter",
  space: " ",
  spacebar: " ",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
  del: "delete",
  plus: "+",
};

function shortcutTokens(shortcut: string): string[] {
  const trimmed = shortcut.trim();
  if (trimmed === "") return [];
  const tokens = trimmed.split("+").map((t) => t.trim());
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "" && i > 0) {
      if (out[out.length - 1] !== "+") out.push("+");
      continue;
    }
    if (tokens[i] !== "") out.push(tokens[i] as string);
  }
  return out;
}

export function parseShortcut(shortcut: string): ParsedShortcut {
  const parsed: ParsedShortcut = {
    mod: false,
    meta: false,
    ctrl: false,
    alt: false,
    shift: false,
    key: "",
  };
  for (const token of shortcutTokens(shortcut)) {
    const lower = token.toLowerCase();
    const modifier = MODIFIER_TOKENS[lower];
    if (modifier) parsed[modifier] = true;
    else parsed.key = KEY_ALIASES[lower] ?? lower;
  }
  return parsed;
}

export function matchesShortcut(
  e: Pick<KeyboardEvent, "key" | "code" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">,
  parsed: ParsedShortcut
): boolean {
  if (parsed.key === "") return false;
  const key = e.key.toLowerCase();
  const byCode =
    parsed.key.length === 1 &&
    /[a-z0-9]/.test(parsed.key) &&
    (e.altKey || !/^[a-z0-9]$/i.test(e.key)) &&
    e.code.toLowerCase() === (/[a-z]/.test(parsed.key) ? `key${parsed.key}` : `digit${parsed.key}`);
  if (key !== parsed.key && !byCode) return false;
  if (parsed.mod) {
    if (!e.metaKey && !e.ctrlKey) return false;
  } else if (e.metaKey !== parsed.meta || e.ctrlKey !== parsed.ctrl) {
    return false;
  }
  if (e.altKey !== parsed.alt) return false;
  if (parsed.shift && !e.shiftKey) return false;
  return true;
}

export function hasModifier(parsed: ParsedShortcut): boolean {
  return parsed.mod || parsed.meta || parsed.ctrl || parsed.alt;
}

const CAP_LABELS: Record<string, { mac: string; other: string }> = {
  mod: { mac: "⌘", other: "Ctrl" },
  meta: { mac: "⌘", other: "Win" },
  ctrl: { mac: "⌃", other: "Ctrl" },
  alt: { mac: "⌥", other: "Alt" },
  shift: { mac: "⇧", other: "Shift" },
  enter: { mac: "↵", other: "Enter" },
  escape: { mac: "Esc", other: "Esc" },
  backspace: { mac: "⌫", other: "Backspace" },
  delete: { mac: "⌦", other: "Del" },
  tab: { mac: "⇥", other: "Tab" },
  " ": { mac: "Space", other: "Space" },
  arrowup: { mac: "↑", other: "↑" },
  arrowdown: { mac: "↓", other: "↓" },
  arrowleft: { mac: "←", other: "←" },
  arrowright: { mac: "→", other: "→" },
};

const PREFORMATTED = /^[⌘⌃⌥⇧↵⌫⌦⇥↑↓←→]+[A-Za-z0-9]?$/;

export function formatShortcut(shortcut: string, mac: boolean): string[] {
  const caps: string[] = [];
  for (const token of shortcutTokens(shortcut)) {
    if (PREFORMATTED.test(token)) {
      caps.push(...Array.from(token));
      continue;
    }
    const lower = token.toLowerCase();
    const modifier = MODIFIER_TOKENS[lower];
    const name = modifier ?? (KEY_ALIASES[lower] ?? lower);
    const cap = CAP_LABELS[name];
    if (cap) caps.push(mac ? cap.mac : cap.other);
    else if (name.length === 1) caps.push(name.toUpperCase());
    else caps.push(name.charAt(0).toUpperCase() + name.slice(1));
  }
  return caps;
}

export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

let macPlatform: boolean | null = null;
const readMac = () => (macPlatform ??= isMacPlatform());
const serverMac = () => true;
const subscribeNever = () => () => {};

export function useIsMac(): boolean {
  return useSyncExternalStore(subscribeNever, readMac, serverMac);
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function isEditable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export function defaultCommandMenuFilter(
  item: CommandMenuItemData,
  query: string
): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [item.label, item.description ?? "", ...(item.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
}

export function sectionRows(
  visible: readonly CommandMenuItemData[],
  suggestions: readonly string[] | undefined,
  suggestionsLabel: string,
  query: string
): CommandMenuSection[] {
  const sections: CommandMenuSection[] = [];
  const byHeading = new Map<string | null, CommandMenuSection>();
  const suggested = new Set(query === "" ? suggestions ?? [] : []);
  let index = 0;
  const push = (heading: string | null, id: string, item: CommandMenuItemData) => {
    let section = byHeading.get(heading);
    if (!section) {
      section = { id, heading, items: [], start: 0 };
      byHeading.set(heading, section);
      sections.push(section);
    }
    section.items.push(item);
  };
  if (suggested.size > 0) {
    const pool = new Map(visible.map((item) => [item.value, item]));
    for (const value of suggestions ?? []) {
      const item = pool.get(value);
      if (item) push(suggestionsLabel, "suggestions", item);
    }
  }
  for (const item of visible) {
    if (suggested.has(item.value)) continue;
    push(item.group ?? null, item.group ? `group:${item.group}` : "ungrouped", item);
  }
  for (const section of sections) {
    section.start = index;
    index += section.items.length;
  }
  return sections;
}

interface HighlightStore {
  get: () => number | null;
  subscribe: (listener: () => void) => () => void;
}

interface CommandMenuContextValue {
  query: string;
  setQuery: (query: string) => void;
  sections: CommandMenuSection[];
  rows: CommandMenuItemData[];
  itemsByValue: Map<string, CommandMenuItemData>;
  listId: string;
  listRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  registerItem: UseFluidHoverReturn["registerItem"];
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  listHandlers: UseFluidHoverReturn["handlers"];
  highlight: HighlightStore;
  select: (item: CommandMenuItemData) => void;
  move: (to: 1 | -1 | "first" | "last") => void;
  tabsRef: RefObject<CommandMenuTabsHandle | null>;
  tabsMounted: boolean;
  setTabsMounted: (mounted: boolean) => void;
}

const CommandMenuFillContext = createContext<FluidHoverSource | null>(null);

interface CommandMenuTabsHandle {
  tabs: readonly CommandMenuTab[];
  value: string;
  onValueChange: (value: string) => void;
}

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

function useCommandMenu(): CommandMenuContextValue {
  const ctx = useContext(CommandMenuContext);
  if (!ctx)
    throw new Error("CommandMenu compound components must be inside <CommandMenu>");
  return ctx;
}

const CommandMenuIndexContext = createContext<number>(0);

interface CommandMenuDialogContextValue {
  close: () => void;
}

const CommandMenuDialogContext = createContext<CommandMenuDialogContextValue | null>(null);

export interface CommandMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: readonly CommandMenuItemData[];
  onSelect?: (item: CommandMenuItemData) => void;
  filter?: (item: CommandMenuItemData, query: string) => boolean;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  suggestions?: readonly string[];
  suggestionsLabel?: string;
  closeOnSelect?: boolean;
  size?: SizeVariant;
  children: ReactNode;
}

const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (
    {
      items,
      onSelect,
      filter = defaultCommandMenuFilter,
      query: queryProp,
      defaultQuery = "",
      onQueryChange,
      suggestions,
      suggestionsLabel = "Suggestions",
      closeOnSelect = true,
      size,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const listId = useId();
    const listRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dialog = useContext(CommandMenuDialogContext);
    const tabsRef = useRef<CommandMenuTabsHandle | null>(null);
    const [tabsMounted, setTabsMounted] = useState(false);

    const [internalQuery, setInternalQuery] = useState(defaultQuery);
    const query = queryProp ?? internalQuery;
    const setQuery = useCallback(
      (next: string) => {
        if (queryProp === undefined) setInternalQuery(next);
        onQueryChange?.(next);
      },
      [queryProp, onQueryChange]
    );

    const itemsByValue = useMemo(() => {
      const map = new Map<string, CommandMenuItemData>();
      for (const item of items) map.set(item.value, item);
      return map;
    }, [items]);

    const sections = useMemo(() => {
      const visible = query === "" ? items : items.filter((item) => filter(item, query));
      return sectionRows(visible, suggestions, suggestionsLabel, query);
    }, [items, query, filter, suggestions, suggestionsLabel]);
    const rows = useMemo(() => sections.flatMap((s) => s.items), [sections]);
    const rowsKey = rows.map((row) => row.value).join("\u0000");

    const hover = useFluidHover(listRef, { isItemDisabled: isDisabledRow });
    const { activeIndex, setActiveIndex, registerItem, itemRects, isMeasured, sessionRef } = hover;
    const { onMouseEnter, onMouseMove, onMouseLeave, onClick } = hover.handlers;
    const listHandlers = useMemo(
      () => ({ onMouseEnter, onMouseMove, onMouseLeave, onClick }),
      [onMouseEnter, onMouseMove, onMouseLeave, onClick]
    );

    const highlightRef = useRef<number | null>(null);
    const listenersRef = useRef(new Set<() => void>());
    const highlight = useMemo<HighlightStore>(
      () => ({
        get: () => highlightRef.current,
        subscribe: (listener) => {
          listenersRef.current.add(listener);
          return () => {
            listenersRef.current.delete(listener);
          };
        },
      }),
      []
    );
    useIsoLayoutEffect(() => {
      highlightRef.current = activeIndex;
      listenersRef.current.forEach((listener) => listener());
    }, [activeIndex]);
    const fill = useMemo<FluidHoverSource>(
      () => ({ activeIndex, itemRects, isMeasured, sessionRef }),
      [activeIndex, itemRects, isMeasured, sessionRef]
    );

    const reduceMotion = useReducedMotion() ?? false;
    const scrollAnimationRef = useRef<{ stop: () => void } | null>(null);
    const scrollToRow = useCallback(
      (index: number, mode: "center" | "top") => {
        const list = listRef.current;
        const viewport = list?.closest<HTMLElement>('[data-slot="scroll-area-viewport"]');
        if (!list || !viewport) return;
        scrollAnimationRef.current?.stop();
        scrollAnimationRef.current = null;
        if (mode === "top" || index === 0) {
          viewport.scrollTop = 0;
          return;
        }
        const row = list.querySelector<HTMLElement>(`[data-fluid-hover-index="${index}"]`);
        if (!row) return;
        const rowTop = row.offsetTop + list.offsetTop;
        const target = Math.max(
          0,
          Math.min(
            rowTop + row.offsetHeight / 2 - viewport.clientHeight / 2,
            viewport.scrollHeight - viewport.clientHeight
          )
        );
        if (reduceMotion) {
          viewport.scrollTop = target;
          return;
        }
        scrollAnimationRef.current = animate(viewport.scrollTop, target, {
          ...spring.fast,
          onUpdate: (value) => {
            viewport.scrollTop = value;
          },
        });
      },
      [reduceMotion]
    );
    useEffect(() => () => scrollAnimationRef.current?.stop(), []);

    const rowsRef = useRef(rows);
    rowsRef.current = rows;
    useEffect(() => {
      const first = rowsRef.current.findIndex((row) => !row.disabled);
      setActiveIndex(first === -1 ? null : first);
      scrollToRow(0, "top");
    }, [rowsKey, setActiveIndex, scrollToRow]);

    const move = useCallback(
      (to: 1 | -1 | "first" | "last") => {
        const enabled: number[] = [];
        rowsRef.current.forEach((row, i) => {
          if (!row.disabled) enabled.push(i);
        });
        if (enabled.length === 0) return;
        let next: number;
        if (to === "first") next = enabled[0] as number;
        else if (to === "last") next = enabled[enabled.length - 1] as number;
        else {
          const current = highlightRef.current;
          const pos = current === null ? -1 : enabled.indexOf(current);
          if (pos === -1)
            next = (to === 1 ? enabled[0] : enabled[enabled.length - 1]) as number;
          else
            next = enabled[
              (pos + to + enabled.length) % enabled.length
            ] as number;
        }
        setActiveIndex(next);
        scrollToRow(next, "center");
      },
      [setActiveIndex, scrollToRow]
    );

    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    const select = useCallback(
      (item: CommandMenuItemData) => {
        if (item.disabled) return;
        item.onSelect?.();
        onSelectRef.current?.(item);
        if (closeOnSelect) dialog?.close();
      },
      [closeOnSelect, dialog]
    );

    const ctx = useMemo<CommandMenuContextValue>(
      () => ({
        query,
        setQuery,
        sections,
        rows,
        itemsByValue,
        listId,
        listRef,
        inputRef,
        registerItem,
        setActiveIndex,
        listHandlers,
        highlight,
        select,
        move,
        tabsRef,
        tabsMounted,
        setTabsMounted,
      }),
      [
        query,
        setQuery,
        sections,
        rows,
        itemsByValue,
        listId,
        registerItem,
        setActiveIndex,
        listHandlers,
        highlight,
        select,
        move,
        tabsMounted,
      ]
    );

    const columnRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    useEffect(() => {
      const el = columnRef.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      const update = () => setHeight(el.offsetHeight);
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const root = (
      <CommandMenuContext.Provider value={ctx}>
        <CommandMenuFillContext.Provider value={fill}>
          <div
            ref={ref}
            data-slot="command-menu"
            className={cn("relative w-full max-h-[inherit] overflow-hidden", className)}
            {...props}
          >
            <motion.div
              className="max-h-[inherit] overflow-hidden"
              initial={false}
              animate={height === null ? {} : { height }}
              transition={reduceMotion ? { duration: 0 } : spring.moderate}
            >
              <div ref={columnRef} className="flex max-h-[inherit] min-h-0 flex-col">
                {children}
              </div>
            </motion.div>
          </div>
        </CommandMenuFillContext.Provider>
      </CommandMenuContext.Provider>
    );

    return size ? <SizeProvider size={size}>{root}</SizeProvider> : root;
  }
);

CommandMenu.displayName = "CommandMenu";

export interface CommandMenuInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size"
  > {
  placeholder?: string;
  icon?: IconComponent | null;
}

const CommandMenuInput = forwardRef<HTMLInputElement, CommandMenuInputProps>(
  (
    { className, placeholder = "Type a command or search…", icon, onKeyDown, ...props },
    ref
  ) => {
    const SearchIcon = useIcon("search");
    const Icon = icon === undefined ? SearchIcon : icon;
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const { query, setQuery, rows, listId, inputRef, highlight, select, move, tabsRef } =
      useCommandMenu();
    const activeIndex = useSyncExternalStore(highlight.subscribe, highlight.get, () => null);
    const dialog = useContext(CommandMenuDialogContext);

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowRight": {
          const tabs = tabsRef.current;
          if (!tabs || tabs.tabs.length === 0 || e.altKey || e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          const count = tabs.tabs.length;
          const current = tabs.tabs.findIndex((tab) => tab.value === tabs.value);
          const step = e.key === "ArrowRight" ? 1 : -1;
          const next = ((current === -1 ? 0 : current) + step + count) % count;
          tabs.onValueChange(tabs.tabs[next]?.value ?? tabs.value);
          return;
        }
        case "ArrowDown":
          e.preventDefault();
          move(1);
          return;
        case "ArrowUp":
          e.preventDefault();
          move(-1);
          return;
        case "Home":
          if (query !== "") return;
          e.preventDefault();
          move("first");
          return;
        case "End":
          if (query !== "") return;
          e.preventDefault();
          move("last");
          return;
        case "Enter": {
          e.preventDefault();
          const row = activeIndex === null ? undefined : rows[activeIndex];
          if (row) select(row);
          return;
        }
        case "Escape":
          if (dialog || query === "") return;
          e.preventDefault();
          setQuery("");
          return;
        default:
          return;
      }
    };

    return (
      <div
        data-slot="command-menu-input"
        className={cn(
          "group/command-input flex shrink-0 items-center",
          compact ? "h-10 gap-2 px-3" : "h-12 gap-2.5 px-4"
        )}
      >
        {Icon && (
          <Icon
            size={sizeClasses.icon}
            strokeWidth={1.5}
            className="shrink-0 text-muted-foreground transition-[color,stroke-width] duration-80 group-focus-within/command-input:text-foreground group-focus-within/command-input:stroke-[2]"
          />
        )}
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="text"
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex === null ? undefined : `${listId}-${activeIndex}`}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-w-0 flex-1 rounded-none bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-[inherit]",
            compact ? "text-[13px] leading-5" : "text-[14px] leading-6",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CommandMenuInput.displayName = "CommandMenuInput";

export interface CommandMenuTab {
  value: string;
  label: string;
  icon?: IconComponent;
}

export interface CommandMenuTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  tabs: readonly CommandMenuTab[];
  value: string;
  onValueChange: (value: string) => void;
  children?: ReactNode;
}

const TabsRowContext = createContext(false);

const CommandMenuTabs = forwardRef<HTMLDivElement, CommandMenuTabsProps>(
  ({ tabs, value, onValueChange, className, children, ...props }, ref) => {
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const { tabsRef, setTabsMounted } = useCommandMenu();
    const selectedIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab.value === value)
    );

    useIsoLayoutEffect(() => {
      tabsRef.current = { tabs, value, onValueChange };
      return () => {
        tabsRef.current = null;
      };
    }, [tabsRef, tabs, value, onValueChange]);
    useEffect(() => {
      setTabsMounted(true);
      return () => setTabsMounted(false);
    }, [setTabsMounted]);

    return (
      <div
        ref={ref}
        data-slot="command-menu-tabs"
        className={cn(
          "flex shrink-0 items-center",
          compact ? "gap-1 px-2 pb-1.5" : "gap-2 px-2.5 pb-2",
          className
        )}
        {...props}
      >
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="flex min-w-0 flex-1 items-center"
        >
          <TabsSubtle
            size="compact"
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              const tab = tabs[index];
              if (tab) onValueChange(tab.value);
            }}
            aria-label="Filter results"
          >
            {tabs.map((tab, index) => (
              <TabsSubtleItem key={tab.value} index={index} label={tab.label} icon={tab.icon} />
            ))}
          </TabsSubtle>
        </div>
        {children && (
          <TabsRowContext.Provider value={true}>
            <div className="ml-auto flex shrink-0 items-center">{children}</div>
          </TabsRowContext.Provider>
        )}
      </div>
    );
  }
);

CommandMenuTabs.displayName = "CommandMenuTabs";

export type CommandMenuFiltersProps = HTMLAttributes<HTMLDivElement>;

const CommandMenuFilters = forwardRef<HTMLDivElement, CommandMenuFiltersProps>(
  ({ className, children, ...props }, ref) => {
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const inTabsRow = useContext(TabsRowContext);
    return (
      <div
        ref={ref}
        data-slot="command-menu-filters"
        className={cn(
          "flex shrink-0 items-center gap-1",
          "[&_[role=combobox]]:w-auto [&_[role=combobox]]:min-w-0",
          !inTabsRow && "flex-wrap",
          !inTabsRow && (compact ? "px-2 pb-1.5" : "px-2.5 pb-2"),
          className
        )}
        {...props}
      >
        <SizeProvider size="compact">{children}</SizeProvider>
      </div>
    );
  }
);

CommandMenuFilters.displayName = "CommandMenuFilters";

export interface CommandMenuListProps extends HTMLAttributes<HTMLDivElement> {
  renderItem?: (item: CommandMenuItemData, index: number) => ReactNode;
  children?: ReactNode;
}

const CommandMenuList = forwardRef<HTMLDivElement, CommandMenuListProps>(
  ({ className, children, renderItem, ...props }, ref) => {
    const { sections, rows, listId, listRef, setActiveIndex, listHandlers } = useCommandMenu();
    const listShape = usePopupShape();
    const fill = useContext(CommandMenuFillContext);
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const empty = rows.length === 0;

    const lastActiveRef = useRef<number | null>(null);
    if (fill && fill.activeIndex !== null) lastActiveRef.current = fill.activeIndex;
    const handleMouseLeave = () => {
      listHandlers.onMouseLeave();
      setActiveIndex(lastActiveRef.current);
    };

    return (
      <ScrollArea
        className="scroll-divider flex min-h-0 flex-1 flex-col border-t border-border/60 [&::before]:!-top-px"
        viewportClassName="min-h-0 flex-1 [&>div[style]]:!block [&>div[style]]:!min-w-0 [--scroll-fade-size:32px] scroll-fade"
      >
        <div
          ref={(node) => {
            listRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          id={listId}
          role="listbox"
          tabIndex={-1}
          data-slot="command-menu-list"
          data-empty={empty || undefined}
          onMouseEnter={listHandlers.onMouseEnter}
          onMouseMove={listHandlers.onMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={listHandlers.onClick}
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            "relative flex flex-col gap-1 p-1 outline-none data-[empty]:p-0",
            className
          )}
          {...props}
        >
          {fill && <FluidHoverHighlight hover={fill} className={listShape.bg} />}
          {children}
          {sections.map((section, sectionIndex) => {
            const headingId = section.heading ? `${listId}-group-${sectionIndex}` : undefined;
            return (
              <div
                key={section.id}
                role="group"
                aria-labelledby={headingId}
                className="flex flex-col"
              >
                {section.heading && (
                  <div
                    id={headingId}
                    role="presentation"
                    className={cn(
                      "flex shrink-0 items-center text-caption text-muted-foreground",
                      compact ? "h-6 px-1.5" : "h-7 px-2"
                    )}
                  >
                    {section.heading}
                  </div>
                )}
                {section.items.map((item, i) => {
                  const index = section.start + i;
                  return (
                    <CommandMenuIndexContext.Provider key={item.value} value={index}>
                      {renderItem ? renderItem(item, index) : <CommandMenuItem value={item.value} />}
                    </CommandMenuIndexContext.Provider>
                  );
                })}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  }
);

CommandMenuList.displayName = "CommandMenuList";

export type CommandMenuEmptyProps = HTMLAttributes<HTMLDivElement>;

const CommandMenuEmpty = forwardRef<HTMLDivElement, CommandMenuEmptyProps>(
  ({ className, ...props }, ref) => {
    const { rows } = useCommandMenu();
    const sizeClasses = useSize();
    if (rows.length > 0) return null;
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-slot="command-menu-empty"
        className={cn(
          "px-3 py-6 text-center text-muted-foreground",
          sizeClasses.text,
          className
        )}
        {...props}
      />
    );
  }
);

CommandMenuEmpty.displayName = "CommandMenuEmpty";

export interface CommandMenuShortcutProps extends HTMLAttributes<HTMLElement> {
  keys: string | readonly string[];
}

const CommandMenuShortcut = forwardRef<HTMLElement, CommandMenuShortcutProps>(
  ({ keys, className, ...props }, ref) => {
    const mac = useIsMac();
    const compact = useSize().variant === "compact";
    const caps = (typeof keys === "string" ? [keys] : keys).flatMap((k) =>
      formatShortcut(k, mac)
    );
    return (
      <kbd
        ref={ref}
        data-slot="command-menu-shortcut"
        className={cn("ml-auto inline-flex shrink-0 items-center gap-0.5 align-middle font-sans", className)}
        {...props}
      >
        {caps.map((cap, i) => (
          <span
            key={`${cap}-${i}`}
            className={cn(
              "flex items-center justify-center rounded-[5px] bg-hover text-muted-foreground",
              compact ? "h-4 min-w-4 px-1 text-[10px]" : "h-5 min-w-5 px-1 text-[11px]"
            )}
          >
            {cap}
          </span>
        ))}
      </kbd>
    );
  }
);

CommandMenuShortcut.displayName = "CommandMenuShortcut";

export interface CommandMenuItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string;
  label?: string;
  description?: string;
  icon?: IconComponent;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

const CommandMenuItem = memo(forwardRef<HTMLDivElement, CommandMenuItemProps>(
  (
    {
      value,
      label,
      description,
      icon,
      shortcut,
      disabled,
      onSelect,
      className,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { itemsByValue, listId, registerItem, highlight, select } = useCommandMenu();
    const listShape = usePopupShape();
    const index = useContext(CommandMenuIndexContext);
    const internalRef = useRef<HTMLDivElement | null>(null);
    const sizeClasses = useSize();
    const isActive = useSyncExternalStore(
      highlight.subscribe,
      () => highlight.get() === index,
      () => false
    );

    const data = itemsByValue.get(value);
    const item: CommandMenuItemData = {
      ...(data ?? { value, label: value }),
      ...(label !== undefined && { label }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(shortcut !== undefined && { shortcut }),
      ...(disabled !== undefined && { disabled }),
      ...(onSelect !== undefined && { onSelect }),
    };
    const Icon = item.icon;

    useRegisterFluidHoverItem(registerItem, index, internalRef);

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={`${listId}-${index}`}
        role="option"
        aria-selected={isActive}
        aria-disabled={item.disabled || undefined}
        data-fluid-hover-index={index}
        data-value={value}
        data-slot="command-menu-item"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) select(item);
        }}
        className={cn(
          "relative z-10 flex shrink-0 items-center cursor-pointer select-none outline-none",
          sizeClasses.control,
          sizeClasses.gap,
          sizeClasses.itemPx,
          sizeClasses.text,
          listShape.item,
          "transition-[color] duration-80",
          isActive ? "text-foreground" : "text-muted-foreground",
          item.disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            size={sizeClasses.icon}
            strokeWidth={isActive ? 2 : 1.5}
            className="shrink-0 transition-[color,stroke-width] duration-80"
          />
        )}
        {children ?? (
          <span className="flex min-w-0 flex-1 items-baseline gap-2">
            <span className="truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1">
              {item.label}
            </span>
            {item.description && (
              <span
                className={cn(
                  "min-w-0 truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1 transition-[color] duration-80",
                  isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                )}
              >
                {item.description}
              </span>
            )}
          </span>
        )}
        {item.shortcut && <CommandMenuShortcut keys={item.shortcut} />}
      </div>
    );
  }
));

CommandMenuItem.displayName = "CommandMenuItem";

export interface CommandMenuHint {
  label: string;
  keys: string | readonly string[];
}

export interface CommandMenuFooterProps extends HTMLAttributes<HTMLDivElement> {
  hints?: readonly CommandMenuHint[];
  children?: ReactNode;
}

const CommandMenuFooter = forwardRef<HTMLDivElement, CommandMenuFooterProps>(
  ({ hints, className, children, ...props }, ref) => {
    const { rows, highlight, tabsMounted } = useCommandMenu();
    const dialog = useContext(CommandMenuDialogContext);
    const compact = useSize().variant === "compact";
    const activeIndex = useSyncExternalStore(highlight.subscribe, highlight.get, () => null);
    const row = activeIndex === null ? undefined : rows[activeIndex];
    const action = hints ? null : row ? (row.action ?? row.label) : null;
    const resolved: readonly CommandMenuHint[] = hints ?? [
      { label: "Select", keys: ["up", "down"] },
      ...(tabsMounted ? [{ label: "Tabs", keys: ["left", "right"] }] : []),
      ...(dialog ? [{ label: "Close", keys: "esc" }] : []),
    ];
    return (
      <div
        ref={ref}
        data-slot="command-menu-footer"
        className={cn(
          "flex shrink-0 items-center overflow-hidden text-muted-foreground",
          compact ? "h-8 gap-3 px-3 text-[11px]" : "h-10 gap-4 px-4 text-[12px]",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            {resolved.map((hint) => (
              <span key={hint.label} className="flex shrink-0 items-center gap-1.5">
                <span>{hint.label}</span>
                <CommandMenuShortcut keys={hint.keys} className="ml-0" />
              </span>
            ))}
            {action !== null && (
              <span
                data-slot="command-menu-footer-action"
                className="ml-auto flex min-w-0 items-center gap-1.5 text-foreground"
              >
                <span className="truncate">{action}</span>
                <CommandMenuShortcut keys="enter" className="ml-0" />
              </span>
            )}
          </>
        )}
      </div>
    );
  }
);

CommandMenuFooter.displayName = "CommandMenuFooter";

const mountedDialogs: {
  combo: string;
  isOpen: () => boolean;
  inScope: () => boolean;
}[] = [];

function comboKey(parsed: ParsedShortcut): string {
  return [
    parsed.mod && "mod",
    parsed.meta && "meta",
    parsed.ctrl && "ctrl",
    parsed.alt && "alt",
    parsed.shift && "shift",
    parsed.key,
  ]
    .filter(Boolean)
    .join("+");
}

export interface CommandMenuDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shortcut?: string | null;
  shortcutScope?: RefObject<HTMLElement | null>;
  title?: string;
  description?: string;
  modal?: boolean;
  container?: HTMLElement | null;
  className?: string;
  children: ReactNode;
}

function CommandMenuDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = "mod+k",
  shortcutScope,
  title = "Command menu",
  description = "Search for a command to run.",
  modal,
  container,
  className,
  children,
}: CommandMenuDialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const openRef = useRef(open);
  openRef.current = open;
  const scopeRef = useRef(shortcutScope);
  scopeRef.current = shortcutScope;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const controlledRef = useRef(openProp !== undefined);
  controlledRef.current = openProp !== undefined;

  const setOpen = useCallback((next: boolean) => {
    if (!controlledRef.current) setInternalOpen(next);
    onOpenChangeRef.current?.(next);
  }, []);

  useEffect(() => {
    if (!shortcut) return;
    const parsed = parseShortcut(shortcut);
    if (parsed.key === "") return;
    const combo = comboKey(parsed);
    const entry = {
      combo,
      isOpen: () => openRef.current,
      inScope: () => {
        const scope = scopeRef.current?.current;
        return !scope || scope.contains(document.activeElement);
      },
    };
    mountedDialogs.push(entry);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.defaultPrevented) return;
      if (!matchesShortcut(e, parsed)) return;
      if (!hasModifier(parsed) && isEditable(e.target)) return;
      const peers = mountedDialogs.filter((d) => d.combo === combo);
      const answers =
        peers.find((d) => d.isOpen()) ?? peers.slice().reverse().find((d) => d.inScope());
      if (answers !== entry) return;
      e.preventDefault();
      setOpen(!openRef.current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      const i = mountedDialogs.indexOf(entry);
      if (i !== -1) mountedDialogs.splice(i, 1);
    };
  }, [shortcut, setOpen]);

  const dialogCtx = useMemo(() => ({ close: () => setOpen(false) }), [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={modal}>
      <DialogContent
        size="lg"
        container={container}
        showCloseButton={false}
        position="top"
        className={cn(
          "top-[max(12dvh,calc(50dvh-220px))] flex max-h-[min(440px,76dvh)] flex-col overflow-hidden p-0",
          className
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <CommandMenuDialogContext.Provider value={dialogCtx}>
          {children}
        </CommandMenuDialogContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

CommandMenuDialog.displayName = "CommandMenuDialog";

export {
  CommandMenu,
  CommandMenuDialog,
  CommandMenuInput,
  CommandMenuTabs,
  CommandMenuFilters,
  CommandMenuList,
  CommandMenuEmpty,
  CommandMenuItem,
  CommandMenuShortcut,
  CommandMenuFooter,
};
