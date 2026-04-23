import CalendarIcon from "@/assets/icons/CalendarIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerProps {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

const DatePicker = ({ id, value, onChange }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(
    new Date(2021, 7, 21),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const selected = value !== undefined ? value : internalSelected;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleSelect = (date: Date | undefined) => {
    if (onChange) {
      onChange(date);
    } else {
      setInternalSelected(date);
    }
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        id={id}
        ref={buttonRef}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Choose date"
        tabIndex={0}
        className={`heading-s-variant text-08 dark:bg-03 border-05 dark:border-04 hover:border-01 dark:hover:border-01 flex h-12 cursor-pointer items-center justify-between rounded border px-5 transition-colors dark:text-white ${
          open ? "border-01! dark:border-01!" : ""
        }`}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
      >
        <span>{selected && dayjs(selected).format("DD MMM YYYY")}</span>
        <CalendarIcon />
      </div>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose date"
          className="dark:bg-04 absolute top-full left-0 z-50 mt-4 w-63 rounded-lg bg-white p-6 shadow-[0px_10px_20px_0px_rgba(72,84,159,0.25)] dark:shadow-none"
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected || new Date(2021, 7)}
            showOutsideDays
            fixedWeeks
            className="w-full"
            classNames={{
              root: "w-full",
              months: "w-full relative",
              month: "w-full",
              month_grid: "w-full border-collapse",
              nav: "absolute left-0 right-0 top-[2px] z-10 flex justify-between",
              month_caption: "mb-6 flex items-center justify-center",
              caption_label: "heading-s-variant text-08 dark:text-white",
              weekdays: "hidden", // Hide headers entirely
              weekday: "hidden",
              week: "mb-[15px] flex justify-between last:mb-0",
              day: "flex w-[15px] items-center justify-center",
              day_button:
                "heading-s-variant text-08 dark:text-white flex h-full w-full cursor-pointer items-center justify-center border-none bg-transparent !p-0 transition-colors hover:!text-01 focus:outline-none",
              selected: "!text-01 !bg-transparent",
              outside: "!text-05 dark:!text-04",
              today: "!text-01",
              disabled: "opacity-30",
            }}
            components={{
              Chevron: ({ orientation, ...props }) =>
                orientation === "left" ? (
                  <ChevronLeftIcon {...props} />
                ) : (
                  <ChevronRightIcon {...props} />
                ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
