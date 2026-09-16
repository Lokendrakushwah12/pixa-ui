"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { fontWeights } from "../../fluid/lib/font-weight";
import { useShape } from "../../fluid/lib/shape-context";
import { SizeProvider, useSize, type SizeVariant } from "../../fluid/lib/size-context";
import { useIcon } from "../../fluid/lib/icon-context";
import { useFluidHover, useRegisterFluidHoverItem } from "../../fluid/hooks/use-fluid-hover";
import { useMergeSplitBlocks, SelectionBackgrounds } from "../../fluid/hooks/use-merge-split";
import { Button } from "../../components/fluid/button";
import { FluidHoverHighlight } from "../../fluid/shared/fluid-hover-highlight";

export interface AskUserOption {
  id?: string;
  title: string;
  description?: string;
}

export interface AskUserQuestion {
  id?: string;
  title: string;
  options?: AskUserOption[];
  multiSelect?: boolean;
  allowOther?: boolean;
  otherPlaceholder?: string;
  skippable?: boolean;
  nextLabel?: string;
  layout?: "inline" | "stacked";
  chipPosition?: "left" | "right";
  freeText?: boolean;
  freeTextPlaceholder?: string;
  freeTextMultiline?: boolean;
  freeTextValidate?: (value: string) => string | null | undefined;
}

export interface AskUserAnswer {
  questionId: string;
  selectedIds: string[];
  otherText?: string;
  skipped?: boolean;
}

export interface AskUserQuestionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  questions: AskUserQuestion[];
  currentIndex?: number;
  defaultCurrentIndex?: number;
  onCurrentIndexChange?: (index: number) => void;
  answers?: Record<string, AskUserAnswer>;
  defaultAnswers?: Record<string, AskUserAnswer>;
  onAnswersChange?: (answers: Record<string, AskUserAnswer>) => void;
  onComplete?: (answers: Record<string, AskUserAnswer>) => void;
  onSkip?: (questionId: string, currentIndex: number) => void;
  skipLabel?: string;
  size?: SizeVariant;
}

function questionKey(q: AskUserQuestion, i: number) {
  return q.id ?? `q-${i}`;
}

function optionKey(o: AskUserOption, i: number) {
  return o.id ?? `o-${i}`;
}

const mountedInstances: HTMLElement[] = [];

let pointerFocusRedirect = false;

const AskUserQuestions = forwardRef<HTMLDivElement, AskUserQuestionsProps>(
  function AskUserQuestions(
    {
      questions,
      currentIndex: controlledIndex,
      defaultCurrentIndex = 0,
      onCurrentIndexChange,
      answers: controlledAnswers,
      defaultAnswers,
      onAnswersChange,
      onComplete,
      onSkip,
      skipLabel = "Skip",
      size,
      className,
      ...rest
    },
    ref
  ) {
    const sizeClasses = useSize(size);
    const compact = sizeClasses.variant === "compact";

    const [internalIndex, setInternalIndex] = useState(defaultCurrentIndex);
    const isIndexControlled = controlledIndex !== undefined;
    const index = isIndexControlled ? (controlledIndex as number) : internalIndex;
    const setIndex = useCallback(
      (next: number) => {
        if (!isIndexControlled) setInternalIndex(next);
        onCurrentIndexChange?.(next);
      },
      [isIndexControlled, onCurrentIndexChange]
    );

    const [internalAnswers, setInternalAnswers] = useState<
      Record<string, AskUserAnswer>
    >(defaultAnswers ?? {});
    const isAnswersControlled = controlledAnswers !== undefined;
    const answers = isAnswersControlled
      ? (controlledAnswers as Record<string, AskUserAnswer>)
      : internalAnswers;

    const answersRef = useRef(answers);
    useEffect(() => {
      answersRef.current = answers;
    }, [answers]);

    const writeAnswers = useCallback(
      (
        updater: (
          prev: Record<string, AskUserAnswer>
        ) => Record<string, AskUserAnswer>
      ) => {
        const next = updater(answersRef.current);
        answersRef.current = next;
        if (!isAnswersControlled) setInternalAnswers(next);
        onAnswersChange?.(next);
        return next;
      },
      [isAnswersControlled, onAnswersChange]
    );

    const shape = useShape();
    const ArrowLeft = useIcon("arrow-left");
    const ArrowRight = useIcon("arrow-right");

    const ArrowLeftKey = useMemo(
      () =>
        function ArrowLeftKey(p: {
          size?: number;
          strokeWidth?: number;
          className?: string;
        }) {
          return <ArrowLeft {...p} className={cn(p.className, "hidden sm:block")} />;
        },
      [ArrowLeft]
    );
    const ArrowRightKey = useMemo(
      () =>
        function ArrowRightKey(p: {
          size?: number;
          strokeWidth?: number;
          className?: string;
        }) {
          return <ArrowRight {...p} className={cn(p.className, "hidden sm:block")} />;
        },
      [ArrowRight]
    );

    const [isMac] = useState(() => {
      if (typeof navigator === "undefined") return false;
      const nav = navigator as Navigator & {
        userAgentData?: { platform?: string };
      };
      const platform = nav.userAgentData?.platform || nav.platform || "";
      return /mac/i.test(platform);
    });

    const reactId = useId();
    const total = questions.length;
    const safeIndex = Math.max(0, Math.min(index, Math.max(0, total - 1)));
    const question = questions[safeIndex];
    const qId = question ? questionKey(question, safeIndex) : "";
    const currentAnswer = answers[qId];

    const isMulti = !!question?.multiSelect;
    const isSkippable = question?.skippable !== false;
    const isFreeText = !!question?.freeText;
    const isFreeTextMultiline = question?.freeTextMultiline !== false;
    const allowOther = !isFreeText && !!question?.allowOther;
    const selectedIds = useMemo(
      () => currentAnswer?.selectedIds ?? [],
      [currentAnswer]
    );
    const otherText = currentAnswer?.otherText ?? "";

    const options = question?.options ?? [];
    const otherIndex = allowOther ? options.length : -1;
    const rowCount = options.length + (allowOther ? 1 : 0);

    const rootRef = useRef<HTMLDivElement>(null);
    const hasQuestion = !!question;
    useEffect(() => {
      if (!hasQuestion) return;
      const el = rootRef.current;
      if (!el) return;
      mountedInstances.push(el);
      return () => {
        const i = mountedInstances.indexOf(el);
        if (i !== -1) mountedInstances.splice(i, 1);
      };
    }, [hasQuestion]);
    const rowsContainerRef = useRef<HTMLDivElement>(null);
    const otherInputRef = useRef<HTMLTextAreaElement>(null);
    const groupIdCounterRef = useRef(0);
    const prevGroupMapRef = useRef(new Map<number, number>());
    const hover = useFluidHover(rowsContainerRef);
    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      handlers,
      registerItem,
    } = hover;

    const [isOtherMultiline, setIsOtherMultiline] = useState(false);
    useEffect(() => {
      setIsOtherMultiline(false);
    }, [qId]);
    useEffect(() => {
      const el = otherInputRef.current;
      if (!el) return;
      el.style.height = "0px";
      el.style.height = `${el.scrollHeight}px`;
      const lineHeight =
        parseFloat(window.getComputedStyle(el).lineHeight) || 18;
      setIsOtherMultiline(el.scrollHeight > lineHeight * 1.5);
    }, [otherText, qId]);

    useEffect(() => {
      if (!isFreeText) return;
      otherInputRef.current?.focus({ preventScroll: true });
    }, [isFreeText, qId]);

    const contentMeasureRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | "auto">("auto");
    useEffect(() => {
      const el = contentMeasureRef.current;
      if (!el) return;
      const update = () => setContentHeight(el.offsetHeight);
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const focusedIndexRef = useRef<number | null>(null);
    useEffect(() => {
      focusedIndexRef.current = focusedIndex;
    }, [focusedIndex]);
    const [freeTextError, setFreeTextError] = useState<string | null>(null);

    useEffect(() => {
      setActiveIndex(null);
      setFocusedIndex(null);
      setFreeTextError(null);
    }, [safeIndex, setActiveIndex]);

    const restoreFocusRef = useRef(false);
    const markFocusRestore = useCallback(() => {
      if (
        rowsContainerRef.current?.contains(document.activeElement) &&
        focusedIndexRef.current !== null
      ) {
        restoreFocusRef.current = true;
      }
    }, []);
    useEffect(() => {
      if (!restoreFocusRef.current) return;
      restoreFocusRef.current = false;
      const firstRow = rowsContainerRef.current?.querySelector(
        '[data-fluid-hover-index="0"]'
      ) as HTMLElement | null;
      firstRow?.focus();
    }, [safeIndex]);

    const goNext = useCallback(
      (snapshot: Record<string, AskUserAnswer>) => {
        if (safeIndex >= total - 1) {
          onComplete?.(snapshot);
        } else {
          markFocusRestore();
          setIndex(safeIndex + 1);
        }
      },
      [safeIndex, total, onComplete, setIndex, markFocusRestore]
    );

    const handleSingleSelect = useCallback(
      (optId: string) => {
        if (!question) return;
        const text = answersRef.current[qId]?.otherText;
        const snapshot = writeAnswers((prev) => ({
          ...prev,
          [qId]: {
            questionId: qId,
            selectedIds: [optId],
            otherText: text || undefined,
            skipped: false,
          },
        }));
        goNext(snapshot);
      },
      [question, qId, writeAnswers, goNext]
    );

    const handleMultiToggle = useCallback(
      (optId: string) => {
        if (!question) return;
        writeAnswers((prev) => {
          const existing = prev[qId];
          const set = new Set(existing?.selectedIds ?? []);
          if (set.has(optId)) set.delete(optId);
          else set.add(optId);
          return {
            ...prev,
            [qId]: {
              questionId: qId,
              selectedIds: Array.from(set),
              otherText: existing?.otherText,
              skipped: false,
            },
          };
        });
      },
      [question, qId, writeAnswers]
    );

    const handleGroupValueChange = useCallback(
      (vals: string[]) => {
        if (!question) return;
        writeAnswers((prev) => ({
          ...prev,
          [qId]: {
            questionId: qId,
            selectedIds: vals,
            otherText: prev[qId]?.otherText,
            skipped: false,
          },
        }));
      },
      [question, qId, writeAnswers]
    );

    const handleOtherChange = useCallback(
      (text: string) => {
        if (!question) return;
        setFreeTextError(null);
        writeAnswers((prev) => ({
          ...prev,
          [qId]: {
            questionId: qId,
            selectedIds: prev[qId]?.selectedIds ?? [],
            otherText: text,
            skipped: false,
          },
        }));
      },
      [question, qId, writeAnswers]
    );

    const handleOtherSubmit = useCallback(() => {
      if (!question) return;
      const text = (answersRef.current[qId]?.otherText ?? "").trim();
      if (!text) return;
      if (question.freeText && question.freeTextValidate) {
        const message = question.freeTextValidate(text);
        if (message) {
          setFreeTextError(message);
          return;
        }
      }
      setFreeTextError(null);
      const snapshot = writeAnswers((prev) => ({
        ...prev,
        [qId]: {
          questionId: qId,
          selectedIds: prev[qId]?.selectedIds ?? [],
          otherText: text,
          skipped: false,
        },
      }));
      goNext(snapshot);
    }, [question, qId, writeAnswers, goNext]);

    const handleSkip = useCallback(() => {
      if (!question) return;
      const snapshot = writeAnswers((prev) => ({
        ...prev,
        [qId]: {
          questionId: qId,
          selectedIds: prev[qId]?.selectedIds ?? [],
          otherText: prev[qId]?.otherText,
          skipped: true,
        },
      }));
      onSkip?.(qId, safeIndex);
      goNext(snapshot);
    }, [question, qId, writeAnswers, onSkip, safeIndex, goNext]);

    const handleMultiNext = useCallback(() => {
      goNext(answers);
    }, [goNext, answers]);

    const handleBack = useCallback(() => {
      if (safeIndex > 0) {
        markFocusRestore();
        setIndex(safeIndex - 1);
      }
    }, [safeIndex, setIndex, markFocusRestore]);

    useEffect(() => {
      if (!question) return;
      const handler = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
        const root = rootRef.current;
        if (!root) return;
        if (!root.contains(target)) {
          if (mountedInstances.some((el) => el !== root && el.contains(target)))
            return;
          const wrapped = mountedInstances.filter((el) => target.contains(el));
          const pool = wrapped.length > 0 ? wrapped : mountedInstances;
          if (pool[pool.length - 1] !== root) return;
        }
        const code = e.key;
        if (code < "1" || code > "9") return;
        const idx = parseInt(code, 10) - 1;
        if (idx >= 0 && idx < options.length) {
          e.preventDefault();
          const oid = optionKey(options[idx] as AskUserOption, idx);
          if (isMulti) handleMultiToggle(oid);
          else handleSingleSelect(oid);
        } else if (idx === options.length && allowOther) {
          e.preventDefault();
          otherInputRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [
      question,
      options,
      isMulti,
      allowOther,
      handleSingleSelect,
      handleMultiToggle,
    ]);

    const focusRow = (idx: number) => {
      const el = rowsContainerRef.current?.querySelector(
        `[data-fluid-hover-index="${idx}"]`
      ) as HTMLElement | null;
      el?.focus();
    };

    const moveActive = useCallback(
      (next: number) => {
        setActiveIndex(next);
        if (allowOther && next === otherIndex) otherInputRef.current?.focus();
        else focusRow(next);
      },
      [allowOther, otherIndex, setActiveIndex]
    );

    const handleNavKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTextInput && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (
        isTextInput &&
        (e.key === "ArrowUp" || e.key === "ArrowDown") &&
        target.tagName === "TEXTAREA"
      ) {
        const ta = target as HTMLTextAreaElement;
        if (e.key === "ArrowUp" && ta.selectionStart > 0) return;
        if (e.key === "ArrowDown" && ta.selectionEnd < ta.value.length) return;
      }

      const preventBaseUI = (
        e as unknown as { preventBaseUIHandler?: () => void }
      ).preventBaseUIHandler;

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        preventBaseUI?.();
        if (e.key === "ArrowLeft") {
          if (safeIndex > 0) handleBack();
        } else if (isSkippable && total > 1) {
          handleSkip();
        }
        return;
      }

      if (rowCount === 0) return;
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        e.preventDefault();
        e.stopPropagation();
        preventBaseUI?.();
        let next: number;
        if (e.key === "Home") next = 0;
        else if (e.key === "End") next = rowCount - 1;
        else {
          const base = isTextInput ? otherIndex : activeIndex ?? -1;
          next = e.key === "ArrowDown" ? base + 1 : base - 1;
          next = (next + rowCount) % rowCount;
        }
        moveActive(next);
      }
    };

    const handleRootKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter") return;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod || !(isMulti || isFreeText)) return;
      e.preventDefault();
      if (isFreeText) {
        if (otherText.trim().length > 0) handleOtherSubmit();
        return;
      }
      const hasAnswer = selectedIds.length > 0 || otherText.trim().length > 0;
      if (hasAnswer) handleMultiNext();
    };

    if (!question) {
      return (
        <div
          ref={ref}
          className={cn(
            "w-full max-w-[520px] p-5 bg-card border border-border",
            shape.container,
            className
          )}
          {...rest}
        >
          <p className="text-[13px] text-muted-foreground">No questions.</p>
        </div>
      );
    }

    const focusRect =
      focusedIndex !== null && !(allowOther && focusedIndex === otherIndex)
        ? itemRects[focusedIndex]
        : null;

    const selectedIndices = useMemo(() => {
      const set = new Set<number>();
      options.forEach((opt, i) => {
        if (selectedIds.includes(optionKey(opt, i))) set.add(i);
      });
      if (allowOther && otherText.length > 0) set.add(otherIndex);
      return set;
    }, [options, selectedIds, allowOther, otherText, otherIndex]);

    const selectedGroups = useMemo(() => {
      const runs: { start: number; end: number }[] = [];
      const sorted = [...selectedIndices].sort((a, b) => a - b);
      for (const idx of sorted) {
        const last = runs[runs.length - 1];
        if (last && idx === last.end + 1) last.end = idx;
        else runs.push({ start: idx, end: idx });
      }

      const usedIds = new Set<number>();
      const nextGroupMap = new Map<number, number>();
      const groups = runs.map((run) => {
        let stableId: number | null = null;
        for (let i = run.start; i <= run.end; i++) {
          const prev = prevGroupMapRef.current.get(i);
          if (prev !== undefined && !usedIds.has(prev)) {
            stableId = prev;
            break;
          }
        }
        const id = stableId ?? ++groupIdCounterRef.current;
        usedIds.add(id);
        for (let i = run.start; i <= run.end; i++) nextGroupMap.set(i, id);
        return { ...run, id };
      });
      prevGroupMapRef.current = nextGroupMap;
      return groups;
    }, [selectedIndices]);

    const blocks = useMergeSplitBlocks(selectedGroups, itemRects, shape.bgRadius);

    const showBack = total > 1 && safeIndex > 0;
    const showSkip = total > 1 && isSkippable;
    const showSubmit = isMulti || isFreeText;
    const showFooter = showBack || showSkip || showSubmit;

    const firstSelectedRow = options.findIndex((opt, i) =>
      selectedIds.includes(optionKey(opt, i))
    );

    const rowsContent = (
      <div
        ref={rowsContainerRef}
        role={isMulti ? "group" : "radiogroup"}
        aria-labelledby={`${reactId}-${qId}-title`}
        onMouseEnter={handlers.onMouseEnter}
        onMouseMove={handlers.onMouseMove}
        onMouseLeave={handlers.onMouseLeave}
        onClick={handlers.onClick}
        onFocus={(e) => {
          const indexAttr = (e.target as HTMLElement)
            .closest("[data-fluid-hover-index]")
            ?.getAttribute("data-fluid-hover-index");
          if (indexAttr != null) {
            const idx = Number(indexAttr);
            setActiveIndex(idx);
            setFocusedIndex(
              !pointerFocusRedirect &&
                (e.target as HTMLElement).matches(":focus-visible")
                ? idx
                : null
            );
          }
        }}
        onBlur={(e) => {
          if (rowsContainerRef.current?.contains(e.relatedTarget as Node))
            return;
          setFocusedIndex(null);
          setActiveIndex(null);
        }}
        onKeyDown={handleNavKey}
        className="relative flex flex-col -mx-3"
      >
        <AnimatePresence>
          {(() => {
            if (!allowOther) return null;
            const otherRect = itemRects[otherIndex];
            const isEmptyFocused =
              focusedIndex === otherIndex && otherText.length === 0;
            if (!otherRect || !isEmptyFocused) return null;
            return (
              <motion.div
                key="other-input"
                aria-hidden
                className={cn(
                  "absolute pointer-events-none bg-card ring-1 ring-inset ring-border",
                  shape.bg
                )}
                initial={{
                  opacity: 0,
                  top: otherRect.top,
                  left: otherRect.left,
                  width: otherRect.width,
                  height: otherRect.height,
                }}
                animate={{
                  opacity: 1,
                  top: otherRect.top,
                  left: otherRect.left,
                  width: otherRect.width,
                  height: otherRect.height,
                }}
                exit={{ opacity: 0, transition: spring.fast.exit }}
                transition={{
                  ...spring.fast,
                  opacity: { duration: 0.08 },
                }}
              />
            );
          })()}
        </AnimatePresence>

        <FluidHoverHighlight
          hover={hover}
          className={shape.bg}
        />

        <SelectionBackgrounds blocks={blocks} />

        <AnimatePresence>
          {focusRect && (
            <motion.div
              aria-hidden
              className={cn(
                "absolute pointer-events-none border border-[color:var(--focus-ring,#6B97FF)] z-20",
                shape.focusRing
              )}
              initial={{
                opacity: 0,
                top: focusRect.top - 2,
                left: focusRect.left - 2,
                width: focusRect.width + 4,
                height: focusRect.height + 4,
              }}
              animate={{
                opacity: 1,
                top: focusRect.top - 2,
                left: focusRect.left - 2,
                width: focusRect.width + 4,
                height: focusRect.height + 4,
              }}
              exit={{ opacity: 0, transition: spring.fast.exit }}
              transition={{
                ...spring.fast,
                opacity: { duration: 0.08 },
              }}
            />
          )}
        </AnimatePresence>

        {options.map((opt, i) => {
          const oid = optionKey(opt, i);
          const isSelected = selectedIds.includes(oid);
          const isHover = activeIndex === i;
          const showArrow = !isMulti && isHover;
          return (
            <Row
              key={oid}
              index={i}
              registerItem={registerItem}
              role={isMulti ? "checkbox" : "radio"}
              isSelected={isSelected}
              tabIndex={
                i === firstSelectedRow ||
                (firstSelectedRow === -1 && i === 0)
                  ? 0
                  : -1
              }
              onClick={() =>
                isMulti ? handleMultiToggle(oid) : handleSingleSelect(oid)
              }
              onKeyDown={(e) => {
                if (
                  (e.key === " " || e.key === "Enter") &&
                  !e.metaKey &&
                  !e.ctrlKey
                ) {
                  e.preventDefault();
                  if (isMulti) handleMultiToggle(oid);
                  else handleSingleSelect(oid);
                }
              }}
              shape={shape}
              aria-checked={isSelected}
              chipContent={i + 1}
              chipFilled={isSelected}
              isMulti={isMulti}
              showArrow={showArrow}
              bodyLayout={question.layout === "stacked" ? "stacked" : "inline"}
              topAlign={question.layout === "stacked"}
              chipPosition={question.chipPosition ?? "right"}
              arrowIcon={
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="h-3.5 w-3.5"
                />
              }
              hiddenControl={
                isMulti ? (
                  <CheckboxPrimitive.Root
                    name={oid}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden
                  />
                ) : (
                  <RadioPrimitive.Root
                    value={oid}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden
                  />
                )
              }
            >
              {question.layout === "stacked" ? (
                <>
                  <span className="inline-grid">
                    <span
                      className="col-start-1 row-start-1 invisible"
                      style={{ fontVariationSettings: fontWeights.semibold }}
                      aria-hidden="true"
                    >
                      {opt.title}
                    </span>
                    <span
                      className="col-start-1 row-start-1 text-foreground transition-[color,font-variation-settings] duration-80"
                      style={{
                        fontVariationSettings: isSelected
                          ? fontWeights.semibold
                          : fontWeights.medium,
                      }}
                    >
                      {opt.title}
                    </span>
                  </span>
                  {opt.description && (
                    <span
                      className={cn(
                        compact ? "text-[11px]" : "text-[12px]",
                        "text-muted-foreground leading-snug"
                      )}
                    >
                      {opt.description}
                    </span>
                  )}
                </>
              ) : (
                <span>
                  <span className="inline-grid">
                    <span
                      className="col-start-1 row-start-1 invisible"
                      style={{ fontVariationSettings: fontWeights.semibold }}
                      aria-hidden="true"
                    >
                      {opt.title}
                    </span>
                    <span
                      className="col-start-1 row-start-1 text-foreground transition-[color,font-variation-settings] duration-80"
                      style={{
                        fontVariationSettings: isSelected
                          ? fontWeights.semibold
                          : fontWeights.medium,
                      }}
                    >
                      {opt.title}
                    </span>
                  </span>
                  {opt.description && (
                    <>
                      {" "}
                      <span className="text-muted-foreground">
                        {opt.description}
                      </span>
                    </>
                  )}
                </span>
              )}
            </Row>
          );
        })}

        {allowOther && (
          <Row
            index={otherIndex}
            registerItem={registerItem}
            role={null}
            isSelected={otherText.length > 0}
            tabIndex={-1}
            onClick={() => otherInputRef.current?.focus()}
            shape={shape}
            chipContent={otherIndex + 1}
            chipFilled={otherText.length > 0}
            isMulti={isMulti}
            topAlign={isOtherMultiline}
            chipPosition={question.chipPosition ?? "right"}
            ariaLabel={
              question.otherPlaceholder ?? "Describe in your own words"
            }
            showArrow={
              !isMulti &&
              (focusedIndex === otherIndex ||
                activeIndex === otherIndex) &&
              otherText.trim().length > 0
            }
            arrowIcon={
              <ArrowRight
                size={compact ? 12 : 14}
                strokeWidth={2}
                className={compact ? "h-3 w-3" : "h-3.5 w-3.5"}
              />
            }
            onArrowClick={
              !isMulti && otherText.trim().length > 0
                ? handleOtherSubmit
                : undefined
            }
          >
            <span className="inline-grid w-full">
              <textarea
                ref={otherInputRef}
                rows={1}
                value={otherText}
                placeholder={
                  question.otherPlaceholder ??
                  "Describe in your own words…"
                }
                aria-label={
                  question.otherPlaceholder ?? "Describe in your own words"
                }
                onChange={(e) => handleOtherChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  if (e.shiftKey) return;
                  if (!isMulti) {
                    e.preventDefault();
                    handleOtherSubmit();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "col-start-1 row-start-1 block w-full bg-transparent border-0 p-0 m-0 outline-none resize-none overflow-hidden leading-snug text-foreground placeholder:text-muted-foreground",
                  sizeClasses.text
                )}
                style={{ fontVariationSettings: fontWeights.medium }}
              />
            </span>
          </Row>
        )}
      </div>
    );

    const root = (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          "relative w-full max-w-[520px] overflow-hidden bg-card border border-border",
          shape.container,
          className
        )}
        {...rest}
        onKeyDown={(e) => {
          rest.onKeyDown?.(e);
          handleRootKey(e);
        }}
      >
        <div
          className={cn(
            "flex items-center text-muted-foreground",
            compact
              ? "px-3.5 sm:px-4 pt-2.5 sm:pt-3 pb-1.5 text-[11px]"
              : "px-4 sm:px-5 pt-3.5 sm:pt-4 pb-2 text-[12px]"
          )}
        >
          <span>
            Question {safeIndex + 1} of {total}
          </span>
        </div>

        <Field.Root invalid={freeTextError !== null} className="contents">
          <motion.div
            animate={{ height: contentHeight }}
            initial={false}
            transition={spring.slow}
            className="overflow-hidden"
          >
            <div
              ref={contentMeasureRef}
              className={cn(
                compact ? "px-3.5 sm:px-4" : "px-4 sm:px-5",
                showFooter
                  ? "pb-1"
                  : compact
                    ? "pb-2 sm:pb-2.5"
                    : "pb-2.5 sm:pb-3"
              )}
            >
              <div key={qId} className="flex flex-col gap-2">
              <h3
                id={`${reactId}-${qId}-title`}
                className="text-[16px] text-foreground leading-snug"
                style={{ fontVariationSettings: fontWeights.semibold }}
              >
                {question.title}
              </h3>

              {isFreeText ? (
                <div
                  onClick={() => otherInputRef.current?.focus()}
                  className={cn(
                    "relative mt-1 cursor-text transition-colors",
                    compact ? "-mx-2.5 py-2" : "-mx-3 py-2.5",
                    sizeClasses.px,
                    isFreeTextMultiline
                      ? "min-h-[76px]"
                      : compact
                      ? "min-h-8"
                      : "min-h-10",
                    shape.bg,
                    otherText.length > 0
                      ? "bg-active"
                      : "hover:bg-hover focus-within:bg-card focus-within:ring-1 focus-within:ring-inset focus-within:ring-border"
                  )}
                >
                  <Field.Control
                    value={otherText}
                    onValueChange={handleOtherChange}
                    render={
                      <textarea
                        ref={otherInputRef}
                        rows={1}
                        placeholder={
                          question.freeTextPlaceholder ?? "Type your answer…"
                        }
                        aria-labelledby={`${reactId}-${qId}-title`}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          if (e.shiftKey || e.metaKey || e.ctrlKey) return;
                          if (!isFreeTextMultiline) {
                            e.preventDefault();
                            handleOtherSubmit();
                          }
                        }}
                        className={cn(
                          "block w-full bg-transparent border-0 p-0 m-0 outline-none resize-none overflow-hidden leading-snug text-foreground placeholder:text-muted-foreground",
                          sizeClasses.text
                        )}
                        style={{ fontVariationSettings: fontWeights.medium }}
                      />
                    }
                  />
                </div>
              ) : isMulti ? (
                <CheckboxGroupPrimitive
                  value={selectedIds}
                  onValueChange={handleGroupValueChange}
                  render={rowsContent}
                />
              ) : (
                <RadioGroupPrimitive
                  value={selectedIds[0] ?? null}
                  onValueChange={(value) => {
                    if (typeof value === "string") handleSingleSelect(value);
                  }}
                  render={rowsContent}
                />
              )}
            </div>
            </div>
          </motion.div>

          {showFooter && (
            <div
              className={cn(
                "pt-1",
                compact ? "px-3.5 sm:px-4 pb-1.5" : "px-4 sm:px-5 pb-2"
              )}
            >
              <div className="flex items-center justify-between gap-2 -mx-2 sm:-mx-3">
                <div className="relative flex flex-1 min-w-0 items-center gap-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {showBack && (
                      <motion.div
                        key="back"
                        layout="position"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          ...spring.fast,
                          opacity: { duration: 0.1 },
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          leadingIcon={ArrowLeftKey}
                          onClick={handleBack}
                          className="pl-3 sm:pl-2"
                        >
                          Back
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {freeTextError && (
                    <Field.Error
                      key="ft-error"
                      match
                      render={
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            ...spring.fast,
                            opacity: { duration: 0.12 },
                          }}
                          className="min-w-0 px-2 sm:px-3 text-left text-[12px] leading-snug text-destructive"
                        />
                      }
                    >
                      {freeTextError}
                    </Field.Error>
                  )}
                </div>
                <div className="relative flex items-center gap-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {showSkip && (
                      <motion.div
                        key="skip"
                        layout="position"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          ...spring.fast,
                          opacity: { duration: 0.1 },
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          trailingIcon={ArrowRightKey}
                          onClick={handleSkip}
                          className="pr-3 sm:pr-2"
                        >
                          {skipLabel}
                        </Button>
                      </motion.div>
                    )}
                    {showSubmit && (
                      <motion.div
                        key="continue"
                        layout="position"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          ...spring.fast,
                          opacity: { duration: 0.1 },
                        }}
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={
                            isFreeText ? handleOtherSubmit : handleMultiNext
                          }
                          disabled={
                            isFreeText
                              ? otherText.trim().length === 0
                              : selectedIds.length === 0 &&
                                otherText.trim().length === 0
                          }
                          className="pr-3 sm:pr-2"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {question.nextLabel ??
                              (safeIndex >= total - 1 ? "Finish" : "Continue")}
                            <span className="hidden sm:contents">
                              <ShortcutChip shape={shape} tone="inverted">
                                {isMac ? "⌘" : "⌃"}
                                {"↵"}
                              </ShortcutChip>
                            </span>
                          </span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </Field.Root>
      </div>
    );

    return size ? <SizeProvider size={size}>{root}</SizeProvider> : root;
  }
);

AskUserQuestions.displayName = "AskUserQuestions";

function ShortcutChip({
  children,
  tone = "muted",
  shape,
}: {
  children: React.ReactNode;
  tone?: "muted" | "inverted";
  shape: ReturnType<typeof useShape>;
}) {
  return (
    <kbd
      aria-hidden
      suppressHydrationWarning
      className={cn(
        "inline-flex items-center justify-center gap-0.5 px-1 min-w-[18px] h-[18px] text-[11px] leading-none font-sans tracking-wide",
        tone === "inverted"
          ? "bg-background/15 text-background"
          : "bg-foreground/10 text-muted-foreground",
        shape.bg
      )}
    >
      {children}
    </kbd>
  );
}

interface RowProps {
  index: number;
  registerItem: (index: number, element: HTMLElement | null) => void;
  role: "radio" | "checkbox" | null;
  isSelected: boolean;
  tabIndex: number;
  onClick: () => void;
  onKeyDown?: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  shape: ReturnType<typeof useShape>;
  chipContent: React.ReactNode;
  chipFilled: boolean;
  isMulti: boolean;
  ariaLabel?: string;
  "aria-checked"?: boolean;
  showArrow?: boolean;
  arrowIcon?: React.ReactNode;
  onArrowClick?: () => void;
  bodyLayout?: "inline" | "stacked";
  topAlign?: boolean;
  chipPosition?: "left" | "right";
  hiddenControl?: React.ReactNode;
  children: React.ReactNode;
}

function Row({
  index,
  registerItem,
  role,
  isSelected,
  tabIndex,
  onClick,
  onKeyDown,
  shape,
  chipContent,
  chipFilled,
  isMulti,
  ariaLabel,
  showArrow,
  arrowIcon,
  onArrowClick,
  bodyLayout = "inline",
  topAlign = false,
  chipPosition = "right",
  hiddenControl,
  children,
  ...aria
}: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const sizeClasses = useSize();
  const compact = sizeClasses.variant === "compact";

  useRegisterFluidHoverItem(registerItem, index, rowRef);

  const arrowOverlay = (
    <AnimatePresence>
      {showArrow && (
        <motion.span
          aria-hidden={!onArrowClick}
          role={onArrowClick ? "button" : undefined}
          onClick={
            onArrowClick
              ? (e) => {
                  e.stopPropagation();
                  onArrowClick();
                }
              : undefined
          }
          className={cn(
            "absolute inset-0 inline-flex items-center justify-center bg-foreground text-background",
            shape.bg,
            onArrowClick && "cursor-pointer"
          )}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.6,
            transition: spring.fast.exit,
          }}
          transition={{
            ...spring.fast,
            opacity: { duration: 0.08 },
          }}
        >
          {arrowIcon}
        </motion.span>
      )}
    </AnimatePresence>
  );

  const chipSlot = (
    <span
      className={cn(
        "shrink-0 relative inline-flex items-center justify-center",
        compact ? "w-6 h-6" : "w-7 h-7",
        topAlign &&
          (bodyLayout === "stacked" ? "-mt-[1px]" : "-mt-[5px]")
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inline-flex items-center justify-center text-[11px] transition-[opacity,font-variation-settings] duration-80",
          compact ? "w-[18px] h-[18px]" : "w-5 h-5",
          isMulti && shape.bg,
          isMulti
            ? chipFilled
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground"
            : chipFilled
            ? "text-foreground"
            : "text-muted-foreground",
          chipPosition === "right" && showArrow && "opacity-0"
        )}
        style={{
          fontVariationSettings: chipFilled
            ? fontWeights.semibold
            : fontWeights.medium,
        }}
      >
        {chipContent}
      </span>
      {chipPosition === "right" && arrowOverlay}
    </span>
  );

  const rightArrowSlot = chipPosition === "left" && !isMulti && (
    <span
      className={cn(
        "shrink-0 w-7 h-7 relative inline-flex items-center justify-center",
        topAlign &&
          (bodyLayout === "stacked" ? "-mt-[1px]" : "-mt-[5px]")
      )}
    >
      {arrowOverlay}
    </span>
  );

  return (
    <div
      ref={rowRef}
      data-fluid-hover-index={index}
      data-state={isSelected ? "checked" : "unchecked"}
      role={role ?? undefined}
      aria-checked={role === "radio" || role === "checkbox" ? !!aria["aria-checked"] : undefined}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      onMouseDown={(e) => {
        const interactive = (e.target as HTMLElement).closest(
          'button:not([tabindex="-1"]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (interactive && interactive !== e.currentTarget) return;
        e.preventDefault();
        pointerFocusRedirect = true;
        try {
          e.currentTarget.focus();
        } finally {
          pointerFocusRedirect = false;
        }
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        "relative z-10 flex cursor-pointer select-none outline-none",
        chipPosition === "left" ? "gap-2" : "gap-3",
        topAlign ? "items-start" : "items-center",
        bodyLayout === "stacked"
          ? compact
            ? "min-h-12 py-1.5"
            : "min-h-14 py-2"
          : compact
            ? "min-h-8 py-1"
            : "min-h-10 py-1.5",
        chipPosition === "left"
          ? isMulti
            ? "pl-1.5 pr-3"
            : "pl-1.5 pr-1.5"
          : "pl-3 pr-1.5",
        shape.item
      )}
    >

      {chipPosition === "left" && chipSlot}

      <span
        className={cn(
          "min-w-0 flex-1 leading-snug",
          sizeClasses.text,
          bodyLayout === "stacked"
            ? "flex flex-col gap-0.5"
            : "inline-flex items-center gap-0"
        )}
      >
        {children}
      </span>

      {chipPosition === "right" ? chipSlot : rightArrowSlot}

      {hiddenControl}
    </div>
  );
}

export { AskUserQuestions };
export default AskUserQuestions;
