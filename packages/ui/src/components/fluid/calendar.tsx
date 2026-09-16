"use client";

import { DayPicker, getDefaultClassNames, type DayPickerProps } from "react-day-picker";

import { cn } from "../../lib/utils";
import { useIcon } from "../../fluid/lib/icon-context";
import { useShape } from "../../fluid/lib/shape-context";

function Calendar({ className, classNames, ...props }: DayPickerProps) {
  const defaults = getDefaultClassNames();
  const shape = useShape();
  const ChevronLeft = useIcon("chevron-right");

  return (
    <DayPicker
      data-slot="calendar"
      className={cn("w-fit p-3", className)}
      components={{
        Chevron: ({ orientation }) => (
          <ChevronLeft
            className={cn(
              "size-4",
              orientation === "left" && "rotate-180",
              orientation === "up" && "-rotate-90",
              orientation === "down" && "rotate-90"
            )}
          />
        ),
      }}
      classNames={{
        root: cn(defaults.root, "relative"),
        months: "flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-[13px] font-medium",
        nav: "absolute top-0 flex w-full items-center justify-between",
        button_previous: cn(
          "inline-flex size-8 items-center justify-center text-muted-foreground",
          "transition-colors duration-100 hover:text-foreground",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-40",
          shape.button
        ),
        button_next: cn(
          "inline-flex size-8 items-center justify-center text-muted-foreground",
          "transition-colors duration-100 hover:text-foreground",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-40",
          shape.button
        ),
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-8 text-[11px] font-normal text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative size-8 p-0 text-center",
        day_button: cn(
          "inline-flex size-8 items-center justify-center text-[13px] tabular-nums",
          "transition-colors duration-100",
          "hover:bg-accent hover:text-accent-foreground",
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
          shape.item
        ),
        today: "font-medium text-foreground underline underline-offset-4",
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground",
          "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground"
        ),
        range_start: "[&>button]:rounded-r-none",
        range_middle: cn(
          "bg-accent",
          "[&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-foreground"
        ),
        range_end: "[&>button]:rounded-l-none",
        outside: "text-muted-foreground/40",
        disabled: "text-muted-foreground/30",
        hidden: "invisible",
        week_number: "w-8 text-[11px] text-muted-foreground tabular-nums",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
