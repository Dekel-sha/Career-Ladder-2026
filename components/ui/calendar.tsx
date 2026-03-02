"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium text-[#1F1F1F]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          "size-8 p-0 rounded-md bg-transparent hover:bg-[#F6F8FA] border-none transition-all duration-150 text-[#1F1F1F]",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex gap-1",
        head_cell:
          "text-[#6B6F76] rounded-md w-9 font-normal text-sm",
        row: "flex w-full mt-1 gap-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "",
        ),
        day: cn(
          "size-9 p-0 font-normal text-sm rounded-full transition-all duration-150",
          "text-[#1F1F1F] hover:bg-[#E6F0FF]",
          "aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#0066FF] aria-selected:text-white aria-selected:hover:bg-[#0066FF]",
        day_range_end:
          "day-range-end aria-selected:bg-[#0066FF] aria-selected:text-white aria-selected:hover:bg-[#0066FF]",
        day_selected:
          "bg-[#0066FF] text-white hover:bg-[#0066FF] hover:text-white focus:bg-[#0066FF] focus:text-white",
        day_today: "border-2 border-[#0066FF] bg-transparent text-[#1F1F1F] font-medium",
        day_outside:
          "day-outside text-[#D0D4DA] aria-selected:text-white opacity-50",
        day_disabled: "text-[#D0D4DA] opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-[#E6F0FF] aria-selected:text-[#0066FF]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
