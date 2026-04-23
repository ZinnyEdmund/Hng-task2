import type { ComponentProps } from "react";

const CheckIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.707031 3.92847L2.83128 6.05273L8.17698 0.707031"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};

export default CheckIcon;
