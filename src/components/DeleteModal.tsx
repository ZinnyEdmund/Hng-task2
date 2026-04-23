import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Button from "./Button";

const DeleteModal = ({
  isOpen,
  onClose,
  invoiceId,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  onConfirm: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className={cn(
        "fixed inset-0 z-99999 flex items-center justify-center bg-black/50 transition-all duration-300 ease-in-out",
        isOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          "dark:bg-03 w-[90%] max-w-120 rounded-lg bg-white px-12 py-13 transition-all duration-300 ease-in-out max-md:px-8 max-md:py-9",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-modal-title" className="heading-m text-08 mb-3 dark:text-white">
          Confirm Deletion
        </h3>
        <p className="body text-07 dark:text-05 mb-3.5">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be
          undone.
        </p>
        <div className="flex items-center justify-end gap-x-2">
          <Button variant="button-3" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="button-5" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
