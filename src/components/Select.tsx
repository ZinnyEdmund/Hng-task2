import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import { forwardRef, useEffect, useRef, useState } from "react";

interface SelectProps {
  id?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const options = [
  { label: "Net 1 Day", value: "1" },
  { label: "Net 7 Days", value: "7" },
  { label: "Net 14 Days", value: "14" },
  { label: "Net 30 Days", value: "30" },
];

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ id, className, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState("30");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const selectedOption =
      options.find((o) => o.value === currentValue) || options[3];

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSelect = (newValue: string) => {
      setInternalValue(newValue);
      onChange?.(newValue);
      setOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusedIndex(options.findIndex((o) => o.value === currentValue));
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(options.length - 1);
          break;
      }
    };

    return (
      <div className={`relative ${className || ""}`} ref={containerRef}>
        <div
          id={id}
          ref={buttonRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-labelledby={id ? undefined : "select-label"}
          tabIndex={0}
          className={`heading-s-variant text-08 dark:bg-03 border-05 dark:border-04 hover:border-01 dark:hover:border-01 flex h-12 w-full cursor-pointer items-center justify-between rounded border px-5 transition-colors outline-none dark:text-white ${
            open ? "border-01! dark:border-01!" : ""
          }`}
          onClick={() => setOpen(!open)}
          onKeyDown={handleKeyDown}
        >
          <span>{selectedOption.label}</span>
          <ChevronDownIcon />
        </div>

        {open && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={id}
            className="dark:bg-04 absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-[0px_10px_20px_0px_rgba(72,84,159,0.25)] dark:shadow-none"
          >
            {options.map((option, index) => (
              <div key={option.value}>
                <div
                  role="option"
                  aria-selected={option.value === currentValue}
                  className={`heading-s-variant text-08 hover:text-01 focus:text-01 dark:hover:text-01 dark:focus:text-01 flex cursor-pointer items-center px-6 py-4 transition-colors outline-none dark:text-white ${
                    focusedIndex === index ? "bg-05 dark:bg-03" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {option.label}
                </div>
                {index < options.length - 1 && (
                  <div className="bg-05 dark:bg-03 h-px w-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
