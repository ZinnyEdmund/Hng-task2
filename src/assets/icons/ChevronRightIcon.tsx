import type { ComponentProps } from "react";

const ChevronRightIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.707031 0.707153L4.70703 4.70715L0.707031 8.70715"
        stroke="#7C5DFA"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ChevronRightIcon;
