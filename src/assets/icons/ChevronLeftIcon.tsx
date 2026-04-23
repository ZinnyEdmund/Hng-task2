import type { ComponentProps } from "react";

const ChevronLeftIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="5"
      height="10"
      viewBox="0 0 5 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.22791 0.707092L3.8147e-06 4.93499L4.22791 9.1629"
        stroke="#7C5DFA"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ChevronLeftIcon;
