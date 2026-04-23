import Logo from "@/assets/icons/Logo";
import { Link } from "react-router";

const AppLogo = () => {
  return (
    <Link
      to="/"
      aria-label="Go to home page"
      className="bg-primary-light relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-r-3xl max-lg:w-20 max-md:w-18"
    >
      <div className="bg-primary absolute bottom-0 left-0 h-1/2 w-full rounded-tl-3xl" />
      <Logo className="z-1" />
    </Link>
  );
};

export default AppLogo;
