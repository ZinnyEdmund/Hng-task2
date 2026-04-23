import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import Checkbox from "@/components/Checkbox";
import { STATUS_OPTIONS } from "@/lib/constants";
import { useInvoiceContext } from "@/context/InvoiceContext";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

const StatusFilter = () => {
  const { filterStatuses, setFilterStatuses } = useInvoiceContext();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClick = (option: string) => {
    setFilterStatuses((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, option: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(option);
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative flex max-w-48 items-center justify-center md:w-full"
    >
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Filter invoices by status"
        className="heading-s-variant flex items-center gap-x-3.5"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
      >
        {isMobile ? <span>Filter</span> : <span>Filter by status</span>}
        <ChevronDownIcon />
      </button>
      {open && (
        <div
          role="group"
          aria-label="Status filter options"
          className="dark:bg-04 absolute top-[calc(100%+24px)] left-0 z-10 w-full min-w-48 rounded-lg bg-white p-6 max-md:-left-1/2"
        >
          <ul className="space-y-3.75">
            {STATUS_OPTIONS.map((option) => (
              <li
                key={option.id}
                role="checkbox"
                aria-checked={filterStatuses.includes(option.id)}
                tabIndex={0}
                className="group flex cursor-pointer items-center gap-x-3.25"
                onClick={() => handleClick(option.id)}
                onKeyDown={(e) => handleKeyDown(e, option.id)}
              >
                <Checkbox checked={filterStatuses.includes(option.id)} />
                <span className="heading-s-variant">{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
