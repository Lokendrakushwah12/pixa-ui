"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useId,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useIcon, type IconComponent } from "../../fluid/lib/icon-context";
import { cn } from "../../lib/utils";
import { spring, exitFallbackMs } from "../../fluid/lib/springs";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import {
  useMergeSplitBlocks,
  useSelectionRuns,
  SelectionBackgrounds,
} from "../../fluid/hooks/use-merge-split";
import { useShape, usePopupShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { Elevated } from "../../fluid/lib/elevated";
import {
  popupMotionClass,
  popupScrollAreaClass,
  popupViewportClass,
  isDisabledRow,
} from "../../fluid/lib/popup";
import { ScrollArea } from "../../components/fluid/scroll-area";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

type ComboboxItemData = string | { value: string; label: string };

function itemValue(item: ComboboxItemData): string {
  return typeof item === "string" ? item : item.value;
}

function itemLabel(item: ComboboxItemData): string {
  return typeof item === "string" ? item : item.label;
}

function defaultFilter(item: ComboboxItemData, query: string) {
  return itemLabel(item)
    .toLocaleLowerCase()
    .includes(query.toLocaleLowerCase());
}

const CREATE_VALUE = "\u0000create";

function isCreateItem(item: ComboboxItemData): boolean {
  return itemValue(item) === CREATE_VALUE;
}

function defaultCreateLabel(query: string): ReactNode {
  return `Create “${query}”`;
}

interface Highlight {
  index: number;
  keyboard: boolean;
}

type ComboboxValue<Multiple extends boolean> = Multiple extends true
  ? string[]
  : string;

interface ComboboxContextValue {
  values: string[];
  multiple: boolean;
  inputValue: string;
  open: boolean;
  disabled: boolean;
  listId: string;
  filteredItems: readonly ComboboxItemData[];
  itemsByValue: Map<string, ComboboxItemData>;
  createRow: ReactNode | null;
  allSelected: boolean;
  highlightRef: React.RefObject<Highlight | null>;
  setHighlight: (next: Highlight | null) => void;
  setOpen: (open: boolean) => void;
  select: (item: ComboboxItemData) => void;
  remove: (value: string) => void;
  clear: () => void;
  setInputValue: (next: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

const ComboboxHighlightContext = createContext<Highlight | null>(null);

function useComboboxContext() {
  const ctx = useContext(ComboboxContext);
  if (!ctx)
    throw new Error("Combobox compound components must be inside <Combobox>");
  return ctx;
}

interface ComboboxContentContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}

const ComboboxContentContext =
  createContext<ComboboxContentContextValue | null>(null);

const ComboboxItemIndexContext = createContext<number>(0);

interface ComboboxProps<
  T extends ComboboxItemData = ComboboxItemData,
  Multiple extends boolean = false,
> {
  children: ReactNode;
  items: readonly T[];
  multiple?: Multiple;
  value?: ComboboxValue<Multiple>;
  defaultValue?: ComboboxValue<Multiple>;
  onValueChange?: (value: ComboboxValue<Multiple>) => void;
  filter?: (item: T, query: string) => boolean;
  onCreate?: (query: string) => T | void;
  createLabel?: (query: string) => ReactNode;
  hideSelected?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  size?: SizeVariant;
}

function toValues(v: string | readonly string[] | undefined): string[] {
  if (v === undefined) return [];
  if (Array.isArray(v)) return v as string[];
  return v === "" ? [] : [v as string];
}

function Combobox<
  T extends ComboboxItemData = ComboboxItemData,
  Multiple extends boolean = false,
>({
  children,
  items,
  multiple,
  value,
  defaultValue,
  onValueChange,
  filter,
  onCreate,
  createLabel = defaultCreateLabel,
  hideSelected = false,
  disabled = false,
  name,
  required,
  size,
}: ComboboxProps<T, Multiple>) {
  const isMultiple = !!multiple;
  const listId = useId();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [internalValues, setInternalValues] = useState<string[]>(() =>
    toValues(defaultValue)
  );
  const controlledValues = useMemo(() => toValues(value), [value]);
  const values = value !== undefined ? controlledValues : internalValues;

  const itemsByValue = useMemo(() => {
    const map = new Map<string, ComboboxItemData>();
    for (const item of items) map.set(itemValue(item), item);
    return map;
  }, [items]);

  const selectedLabel = useMemo(() => {
    if (isMultiple) return "";
    const item = values[0] !== undefined ? itemsByValue.get(values[0]) : undefined;
    return item ? itemLabel(item) : "";
  }, [isMultiple, values, itemsByValue]);

  const [inputValue, setInputValueState] = useState(selectedLabel);
  const [query, setQuery] = useState("");
  const [open, setOpenState] = useState(false);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const highlightRef = useRef<Highlight | null>(null);

  useEffect(() => {
    setInputValueState(selectedLabel);
  }, [selectedLabel]);

  const trimmedQuery = query.trim();
  const createItem = useMemo<ComboboxItemData | null>(() => {
    if (!onCreate || trimmedQuery === "") return null;
    const lower = trimmedQuery.toLocaleLowerCase();
    const exists = items.some((item) => itemLabel(item).toLocaleLowerCase() === lower);
    return exists ? null : { value: CREATE_VALUE, label: trimmedQuery };
  }, [onCreate, trimmedQuery, items]);

  const hideChecked = hideSelected && isMultiple;
  const filteredItems = useMemo(() => {
    const match = filter ?? defaultFilter;
    let visible = query === "" ? items : items.filter((item) => match(item, query));
    if (hideChecked) visible = visible.filter((item) => !values.includes(itemValue(item)));
    return createItem ? [...visible, createItem] : visible;
  }, [items, query, filter, hideChecked, values, createItem]);
  const allSelected =
    hideChecked && trimmedQuery === "" && items.length > 0 && filteredItems.length === 0;

  const safeHighlight =
    highlight && highlight.index < filteredItems.length ? highlight : null;
  highlightRef.current = safeHighlight;

  const commitValues = useCallback(
    (next: string[]) => {
      if (value === undefined) setInternalValues(next);
      onValueChange?.(
        (isMultiple ? next : (next[0] ?? "")) as ComboboxValue<Multiple>
      );
    },
    [value, onValueChange, isMultiple]
  );

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      if (!next) {
        setQuery("");
        setHighlight(null);
        setInputValueState(selectedLabel);
      }
    },
    [selectedLabel]
  );

  const onCreateRef = useRef(onCreate);
  onCreateRef.current = onCreate;

  const select = useCallback(
    (item: ComboboxItemData) => {
      if (isCreateItem(item)) {
        const made = onCreateRef.current?.(itemLabel(item));
        if (made != null) {
          commitValues(isMultiple ? [...values, itemValue(made)] : [itemValue(made)]);
          setInputValueState(isMultiple ? "" : itemLabel(made));
        } else {
          setInputValueState(isMultiple ? "" : selectedLabel);
        }
        setQuery("");
        setHighlight(null);
        setOpenState(false);
        return;
      }
      const v = itemValue(item);
      if (isMultiple) {
        commitValues(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
        if (query !== "") {
          setInputValueState("");
          setQuery("");
          setHighlight(null);
          setOpenState(false);
        }
        return;
      }
      commitValues([v]);
      setInputValueState(itemLabel(item));
      setQuery("");
      setHighlight(null);
      setOpenState(false);
    },
    [commitValues, isMultiple, values, query, selectedLabel]
  );

  const remove = useCallback(
    (v: string) => {
      commitValues(values.filter((x) => x !== v));
      inputRef.current?.focus();
    },
    [commitValues, values]
  );

  const clear = useCallback(() => {
    commitValues([]);
    setInputValueState("");
    setQuery("");
    setHighlight(null);
    inputRef.current?.focus();
  }, [commitValues]);

  const setInputValue = useCallback(
    (next: string) => {
      setInputValueState(next);
      setQuery(next);
      setOpenState(true);
      setHighlight({ index: 0, keyboard: true });
    },
    []
  );

  useEffect(() => {
    if (open) setHighlight((h) => h ?? { index: 0, keyboard: true });
  }, [open]);

  const createRow = createItem ? createLabel(trimmedQuery) : null;
  const ctx = useMemo<ComboboxContextValue>(
    () => ({
      values,
      multiple: isMultiple,
      inputValue,
      open,
      disabled,
      listId,
      filteredItems,
      itemsByValue,
      createRow,
      allSelected,
      highlightRef,
      setHighlight,
      setOpen,
      select,
      remove,
      clear,
      setInputValue,
      anchorRef,
      inputRef,
    }),
    [
      values,
      isMultiple,
      inputValue,
      open,
      disabled,
      listId,
      filteredItems,
      itemsByValue,
      createRow,
      allSelected,
      setOpen,
      select,
      remove,
      clear,
      setInputValue,
    ]
  );

  const root = (
    <ComboboxContext.Provider value={ctx}>
    <ComboboxHighlightContext.Provider value={safeHighlight}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
        {children}
        {name &&
          (isMultiple ? (
            values.map((v) => (
              <input key={v} type="hidden" name={name} value={v} />
            ))
          ) : (
            <input type="hidden" name={name} value={values[0] ?? ""} required={required} />
          ))}
      </PopoverPrimitive.Root>
    </ComboboxHighlightContext.Provider>
    </ComboboxContext.Provider>
  );

  return size ? <SizeProvider size={size}>{root}</SizeProvider> : root;
}

Combobox.displayName = "Combobox";

const fieldVariants = cva(
  [
    "group flex items-center ring-1 cursor-text",
    "transition-all duration-80",
    "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        bordered:
          "ring-border bg-transparent hover:bg-muted/50 focus-within:bg-card",
        borderless:
          "ring-transparent bg-transparent hover:bg-muted/50 hover:ring-border focus-within:bg-card focus-within:ring-border",
      },
    },
    defaultVariants: {
      variant: "bordered",
    },
  }
);

const fieldButtonClass =
  "flex shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors duration-80 hover:text-foreground focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)] disabled:pointer-events-none";
const clearButtonClass = cn(
  fieldButtonClass,
  "hover:bg-hover active:bg-active transition-[color,background-color]"
);
const chipRemoveClass = cn(fieldButtonClass, "rounded hover:bg-active");

interface ComboboxFieldProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "value" | "defaultValue" | "onChange"
    >,
    VariantProps<typeof fieldVariants> {
  icon?: IconComponent;
  placeholder?: string;
  error?: string;
  clearable?: boolean;
  size?: SizeVariant;
}

type ComboboxInputProps = ComboboxFieldProps;
type ComboboxChipsProps = ComboboxFieldProps;

const FieldInput = forwardRef<
  HTMLInputElement,
  Omit<ComboboxFieldProps, "variant" | "icon" | "error" | "clearable" | "size"> & {
    invalid?: boolean;
    inputClassName?: string;
    inputSize?: number;
  }
>(({ placeholder, invalid, inputClassName, inputSize, onKeyDown, onClick, className: _className, ...props }, ref) => {
  const sizeClasses = useSize();
  const {
    values,
    multiple,
    inputValue,
    open,
    disabled,
    listId,
    filteredItems,
    setHighlight,
    setOpen,
    select,
    remove,
    setInputValue,
    inputRef,
  } = useComboboxContext();
  const highlight = useContext(ComboboxHighlightContext);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const count = filteredItems.length;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          if (count > 0)
            setHighlight({
              index: e.key === "ArrowDown" ? 0 : count - 1,
              keyboard: true,
            });
          return;
        }
        if (count === 0) return;
        const step = e.key === "ArrowDown" ? 1 : -1;
        const current = highlight?.index ?? (step === 1 ? -1 : count);
        const next = current + step;
        if (next < 0 || next >= count) setHighlight(null);
        else setHighlight({ index: next, keyboard: true });
        return;
      }
      case "Enter": {
        if (!open) return;
        e.preventDefault();
        if (highlight && filteredItems[highlight.index]) {
          select(filteredItems[highlight.index]);
        }
        return;
      }
      case "Escape": {
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        return;
      }
      case "Backspace": {
        if (multiple && e.currentTarget.value === "" && values.length > 0) {
          e.preventDefault();
          remove(values[values.length - 1]);
        }
        return;
      }
      default:
        return;
    }
  };

  return (
    <input
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      type="text"
      role="combobox"
      size={inputSize}
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-autocomplete="list"
      aria-activedescendant={
        open && highlight ? `${listId}-${highlight.index}` : undefined
      }
      aria-invalid={invalid || undefined}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      disabled={disabled}
      value={inputValue}
      placeholder={placeholder}
      onChange={(e) => setInputValue(e.target.value)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !open) setOpen(true);
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "min-w-0 flex-1 rounded-none bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-[inherit]",
        sizeClasses.text,
        sizeClasses.variant === "compact" ? "leading-5" : "leading-6",
        inputClassName
      )}
      {...props}
    />
  );
});
FieldInput.displayName = "ComboboxFieldInput";

function FieldControls({
  clearable,
  compact,
  iconSize,
}: {
  clearable: boolean;
  compact: boolean;
  iconSize: number;
}) {
  const XIcon = useIcon("x");
  const pill = useShape().variant === "pill";
  const { values, inputValue, open, disabled, setOpen, clear, inputRef } =
    useComboboxContext();
  return (
    <>
      {clearable && (
        <button
          type="button"
          aria-label="Clear"
          disabled={disabled}
          hidden={!(values.length > 0 || inputValue !== "")}
          onClick={clear}
          className={cn(clearButtonClass, pill && "rounded-full", "[&[hidden]]:invisible [&[hidden]]:flex", compact ? "size-5" : "size-6")}
        >
          <XIcon size={iconSize} strokeWidth={1.5} />
        </button>
      )}
      <button
        type="button"
        aria-label="Open"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => {
          inputRef.current?.focus();
          setOpen(!open);
        }}
        className={cn(fieldButtonClass, compact ? "size-5" : "size-6")}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-80"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </>
  );
}

function FieldFrame({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const { open, disabled, anchorRef, inputRef } = useComboboxContext();
  return (
    <PopoverPrimitive.Anchor asChild>
      <div
        ref={anchorRef}
        data-disabled={disabled || undefined}
        data-popup-open={open || undefined}
        onMouseDown={(e) => {
          if (e.target === inputRef.current) return;
          if ((e.target as HTMLElement).closest("button")) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className={className}
      >
        {children}
      </div>
    </PopoverPrimitive.Anchor>
  );
}

const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  (
    {
      className,
      variant,
      icon: Icon,
      placeholder = "Search…",
      error,
      clearable = false,
      size,
      ...props
    },
    ref
  ) => {
    const shape = useShape();
    const sizeClasses = useSize(size);
    const compact = sizeClasses.variant === "compact";

    return (
      <div className="flex flex-col gap-1">
        <FieldFrame
          className={cn(
            fieldVariants({ variant }),
            sizeClasses.control,
            sizeClasses.gap,
            compact ? "px-2" : "px-2.5",
            compact ? "min-w-[128px]" : "min-w-[160px]",
            shape.input,
            error && "ring-destructive/50 hover:ring-destructive/50 focus-within:ring-destructive/50",
            className
          )}
        >
          {Icon && (
            <Icon
              size={sizeClasses.icon}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground transition-[color,stroke-width] duration-80 group-focus-within:text-foreground group-focus-within:stroke-[2]"
            />
          )}
          <FieldInput ref={ref} placeholder={placeholder} invalid={!!error} {...props} />
          <FieldControls clearable={clearable} compact={compact} iconSize={sizeClasses.icon} />
        </FieldFrame>
        {error && (
          <span className="text-[12px] text-destructive pl-3">{error}</span>
        )}
      </div>
    );
  }
);

ComboboxInput.displayName = "ComboboxInput";

const ComboboxChips = forwardRef<HTMLInputElement, ComboboxChipsProps>(
  (
    {
      className,
      variant,
      icon: Icon,
      placeholder = "Search…",
      error,
      clearable = false,
      size,
      ...props
    },
    ref
  ) => {
    const XIcon = useIcon("x");
    const shape = useShape();
    const sizeClasses = useSize(size);
    const compact = sizeClasses.variant === "compact";
    const { values, itemsByValue, disabled, remove, inputValue } = useComboboxContext();

    return (
      <div className="flex flex-col gap-1">
        <FieldFrame
          className={cn(
            fieldVariants({ variant }),
            "!items-start",
            compact ? "min-h-7 py-1" : "min-h-9 py-1.5",
            sizeClasses.gap,
            compact ? "px-2" : "px-2.5",
            compact ? "min-w-[128px]" : "min-w-[160px]",
            shape.input,
            error && "ring-destructive/50 hover:ring-destructive/50 focus-within:ring-destructive/50",
            className
          )}
        >
          {Icon && (
            <span className={cn("flex shrink-0 items-center", compact ? "h-5" : "h-6")}>
              <Icon
                size={sizeClasses.icon}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground transition-[color,stroke-width] duration-80 group-focus-within:text-foreground group-focus-within:stroke-[2]"
              />
            </span>
          )}
          <div role="toolbar" aria-label="Selected" className="relative flex min-w-0 flex-1 flex-wrap items-center gap-1">
            <AnimatePresence initial={false} mode="popLayout">
              {values.map((v) => {
                const item = itemsByValue.get(v);
                const label = item ? itemLabel(item) : v;
                return (
                  <motion.span
                    key={v}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, pointerEvents: "none", transition: spring.fast.exit }}
                    transition={spring.fast}
                    aria-label={label}
                    className={cn(
                      "inline-flex max-w-full shrink-0 items-center gap-0.5 bg-hover pl-2 pr-0.5 text-foreground",
                      shape.variant === "pill" ? "rounded-full" : "rounded-md",
                      compact ? "h-5 text-[11px]" : "h-6 text-[12px]"
                    )}
                  >
                    <span className="truncate">{label}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      disabled={disabled}
                      onClick={() => remove(v)}
                      className={cn(chipRemoveClass, shape.variant === "pill" && "rounded-full", compact ? "size-4" : "size-5")}
                    >
                      <XIcon size={compact ? 10 : 12} strokeWidth={2} />
                    </button>
                  </motion.span>
                );
              })}
            </AnimatePresence>
            <span className="flex min-w-6 flex-auto">
              <FieldInput
                ref={ref}
                inputSize={Math.max(1, inputValue.length + 1)}
                placeholder={values.length ? undefined : placeholder}
                invalid={!!error}
                inputClassName={cn("w-full", compact ? "h-5 leading-5" : "h-6 leading-6")}
                {...props}
              />
            </span>
          </div>
          <FieldControls clearable={clearable} compact={compact} iconSize={sizeClasses.icon} />
        </FieldFrame>
        {error && (
          <span className="text-[12px] text-destructive pl-3">{error}</span>
        )}
      </div>
    );
  }
);

ComboboxChips.displayName = "ComboboxChips";

type ContentPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;

interface ComboboxContentProps {
  className?: string;
  children: ReactNode;
  side?: ContentPrimitiveProps["side"];
  align?: ContentPrimitiveProps["align"];
  sideOffset?: number;
}

const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, children, side = "bottom", align = "start", sideOffset = 6 }, ref) => {
    const { open, anchorRef } = useComboboxContext();
    const shape = usePopupShape();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      if (open) setMounted(true);
    }, [open]);

    useEffect(() => {
      if (open) return;
      const id = setTimeout(() => setMounted(false), exitFallbackMs(spring.fast));
      return () => clearTimeout(id);
    }, [open]);

    const guardAnchor = (
      e: { target: EventTarget | null; preventDefault: () => void }
    ) => {
      if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
    };

    if (!mounted) return null;

    return (
      <PopoverPrimitive.Portal forceMount>
        <PopoverPrimitive.Content
          ref={ref}
          asChild
          forceMount
          side={side}
          align={align}
          sideOffset={sideOffset}
          role="presentation"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onFocusOutside={guardAnchor}
          onPointerDownOutside={guardAnchor}
          onInteractOutside={guardAnchor}
        >
          <motion.div
            className={cn("z-50 outline-none", popupMotionClass)}
            initial={{ opacity: 0, y: "var(--popup-enter-y)", scaleY: 0.96 }}
            animate={
              open
                ? { opacity: 1, y: 0, scaleY: 1 }
                : { opacity: 0, y: "var(--popup-enter-y)", scaleY: 0.96 }
            }
            transition={open ? spring.fast : spring.fast.exit}
            onAnimationComplete={() => {
              if (!open) setMounted(false);
            }}
          >
            <Elevated
              offset={2}
              shadowLevel={3}
              className={cn(
                `flex flex-col min-w-[var(--radix-popover-trigger-width)] max-h-[min(300px,var(--radix-popover-content-available-height))] overflow-hidden ${shape.container} select-none outline-none`,
                className
              )}
            >
              {children}
            </Elevated>
          </motion.div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);

ComboboxContent.displayName = "ComboboxContent";

interface ComboboxListProps {
  className?: string;
  children: (item: ComboboxItemData, index: number) => ReactNode;
}

const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ className, children }, ref) => {
    const { open, values, multiple, listId, filteredItems, setHighlight, createRow } =
      useComboboxContext();
    const highlight = useContext(ComboboxHighlightContext);
    const PlusIcon = useIcon("plus");
    const shape = usePopupShape();
    const containerRef = useRef<HTMLDivElement>(null);

    const hover = useFluidHover(containerRef, { isItemDisabled: isDisabledRow });
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      isMeasured,
      handlers,
      registerItem,
      remeasure,
    } = hover;

    useEffect(() => {
      if (!open) return;
      remeasure();
    }, [open, remeasure]);

    const checkedIndices = useMemo(
      () =>
        filteredItems
          .map((item, i) => (values.includes(itemValue(item)) ? i : -1))
          .filter((i) => i !== -1),
      [filteredItems, values]
    );

    useEffect(() => {
      if (!highlight) {
        setActiveIndex(null);
        return;
      }
      if (!highlight.keyboard) return;
      setActiveIndex(highlight.index);
      const row = containerRef.current?.querySelector<HTMLElement>(
        `[data-fluid-hover-index="${highlight.index}"]`
      );
      row?.scrollIntoView({ block: "nearest" });
    }, [highlight, setActiveIndex]);

    useEffect(() => {
      if (open) return;
      setActiveIndex(null);
    }, [open, setActiveIndex]);

    const checkedRect =
      isMeasured && !multiple && checkedIndices.length > 0
        ? itemRects[checkedIndices[0]]
        : null;
    const runs = useSelectionRuns(multiple ? checkedIndices : []);
    const blocks = useMergeSplitBlocks(
      runs,
      isMeasured && open ? itemRects : [],
      shape.bgRadius
    );

    const contentCtx = useMemo(
      () => ({ registerItem, activeIndex }),
      [registerItem, activeIndex]
    );

    const empty = filteredItems.length === 0;

    return (
      <ComboboxContentContext.Provider value={contentCtx}>
        <ScrollArea className={popupScrollAreaClass} viewportClassName={cn(popupViewportClass, "scroll-fade")}>
        <div
          ref={(node: HTMLDivElement | null) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          id={listId}
          role="listbox"
          tabIndex={-1}
          data-empty={empty || undefined}
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onClick={handlers.onClick}
          onMouseLeave={() => {
            handlers.onMouseLeave();
            if (highlight && !highlight.keyboard) setHighlight(null);
          }}
          className={cn(
            "relative flex flex-col p-1 outline-none data-[empty]:p-0",
            className
          )}
        >
          {open && multiple && <SelectionBackgrounds blocks={blocks} />}
          {open && !multiple && (
            <AnimatePresence>
              {checkedRect && (
                <motion.div
                  key="checked"
                  aria-hidden
                  className={`absolute ${shape.bg} bg-active pointer-events-none`}
                  initial={false}
                  animate={{
                    top: checkedRect.top,
                    left: checkedRect.left,
                    width: checkedRect.width,
                    height: checkedRect.height,
                    opacity: 1,
                  }}
                  exit={{ opacity: 0, transition: spring.moderate.exit }}
                  transition={{
                    ...spring.moderate,
                    opacity: { duration: 0.08 },
                  }}
                />
              )}
            </AnimatePresence>
          )}

          {open && (
            <FluidHoverHighlight
              hover={hover}
              className={shape.bg}
            />
          )}

          {filteredItems.map((item, index) => (
            <ComboboxItemIndexContext.Provider key={itemValue(item)} value={index}>
              {isCreateItem(item) ? (
                <ComboboxItem value={CREATE_VALUE} icon={PlusIcon}>
                  {createRow}
                </ComboboxItem>
              ) : (
                children(item, index)
              )}
            </ComboboxItemIndexContext.Provider>
          ))}
        </div>
        </ScrollArea>
      </ComboboxContentContext.Provider>
    );
  }
);

ComboboxList.displayName = "ComboboxList";

interface ComboboxItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconComponent;
  value: string;
  disabled?: boolean;
}

const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  (
    { className, children, icon: Icon, value, disabled = false, onClick, ...props },
    ref
  ) => {
    const comboboxCtx = useComboboxContext();
    const contentCtx = useContext(ComboboxContentContext);
    const index = useContext(ComboboxItemIndexContext);
    const internalRef = useRef<HTMLDivElement>(null);
    const shape = usePopupShape();
    const sizeClasses = useSize();
    const compact = sizeClasses.variant === "compact";
    const hasMounted = useRef(false);

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    const registerItem = contentCtx?.registerItem;
    useRegisterFluidHoverItem(registerItem, index, internalRef);

    const isActive = contentCtx?.activeIndex === index;
    const isChecked = comboboxCtx.values.includes(value);
    const skipAnimation = !hasMounted.current;
    const item = comboboxCtx.filteredItems[index];

    return (
      <div
        ref={(node: HTMLDivElement | null) => {
          (internalRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        id={`${comboboxCtx.listId}-${index}`}
        role="option"
        aria-selected={isChecked}
        aria-disabled={disabled || undefined}
        data-fluid-hover-index={index}
        data-value={value}
        onPointerDown={(e) => e.preventDefault()}
        onPointerMove={() => {
          if (disabled) return;
          const h = comboboxCtx.highlightRef.current;
          if (!h || h.index !== index || h.keyboard)
            comboboxCtx.setHighlight({ index, keyboard: false });
        }}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || disabled || !item) return;
          comboboxCtx.select(item);
        }}
        className={cn(
          `relative z-10 flex ${sizeClasses.control} shrink-0 items-center ${sizeClasses.gap} ${shape.item} ${sizeClasses.itemPx} ${sizeClasses.text} cursor-pointer outline-none select-none`,
          "transition-[color] duration-80",
          isActive || isChecked ? "text-foreground" : "text-muted-foreground",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            size={sizeClasses.icon}
            strokeWidth={isActive || isChecked ? 2 : 1.5}
            className="shrink-0 transition-[color,stroke-width] duration-80"
          />
        )}

        <span className="flex-1 min-w-0 truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1">
          {children}
        </span>

        <span
          aria-hidden
          className={cn("shrink-0", compact ? "w-3.5 h-3.5" : "w-4 h-4")}
        >
          <AnimatePresence>
            {isChecked && (
              <motion.svg
                key="check"
                width={sizeClasses.icon}
                height={sizeClasses.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
              >
                <motion.path
                  d="M4 12L9 17L20 6"
                  initial={{ pathLength: skipAnimation ? 1 : 0 }}
                  animate={{
                    pathLength: 1,
                    transition: { duration: 0.08, ease: "easeOut" },
                  }}
                  exit={{
                    pathLength: 0,
                    transition: { duration: 0.04, ease: "easeIn" },
                  }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
      </div>
    );
  }
);

ComboboxItem.displayName = "ComboboxItem";

interface ComboboxEmptyProps extends HTMLAttributes<HTMLDivElement> {
  allSelected?: ReactNode;
}

const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ className, children, allSelected, ...props }, ref) => {
    const { filteredItems, allSelected: exhausted } = useComboboxContext();
    const sizeClasses = useSize();
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "px-3 text-center text-muted-foreground [&:not(:empty)]:py-6",
          sizeClasses.text,
          className
        )}
        {...props}
      >
        {filteredItems.length === 0
          ? exhausted && allSelected !== undefined
            ? allSelected
            : children
          : null}
      </div>
    );
  }
);

ComboboxEmpty.displayName = "ComboboxEmpty";

export {
  Combobox,
  ComboboxInput,
  ComboboxChips,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  fieldVariants as comboboxFieldVariants,
};

export type {
  ComboboxItemData,
  ComboboxValue,
  ComboboxProps,
  ComboboxInputProps,
  ComboboxChipsProps,
  ComboboxContentProps,
  ComboboxListProps,
  ComboboxItemProps,
  ComboboxEmptyProps,
};
