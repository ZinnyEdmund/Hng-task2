import CheckIcon from "@/assets/icons/CheckIcon";
import { cn } from "@/lib/utils";

const Checkbox = ({ checked }: { checked: boolean }) => {
  return (
    <div
      className={cn(
        "group-hover:border-01 flex size-4 items-center justify-center rounded-xs border border-transparent transition-all duration-150 ease-linear",
        checked ? "bg-01" : "bg-05 dark:bg-03",
      )}
    >
      {checked && <CheckIcon />}
    </div>
  );
};

export default Checkbox;
