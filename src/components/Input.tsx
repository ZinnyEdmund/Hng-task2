import { cn } from "@/lib/utils";
import { forwardRef, type ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          "heading-s-variant hover:border-02! dark:hover:border-02! focus:border-02! text-08 dark:bg-03 dark:focus:border-02! caret-01 block h-12 w-full rounded border px-5 focus:outline-none dark:text-white",
          error ? "border-09!" : "border-05! dark:border-04!",
          className,
        )}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
