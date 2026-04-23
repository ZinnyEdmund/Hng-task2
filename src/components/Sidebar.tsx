import MoonIcon from "@/assets/icons/MoonIcon";
import SunIcon from "@/assets/icons/SunIcon";
import avatar from "@/assets/images/avatar.png";
import { useDarkMode } from "@/hooks/useDarkMode";
import AppLogo from "./AppLogo";

const Sidebar = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="bg-sidebar dark:bg-primary-dark z-9999 flex h-20 w-full items-center justify-between overflow-hidden max-md:h-18 lg:h-full lg:w-25.75 lg:flex-col lg:rounded-r-3xl">
      <AppLogo />
      <div className="flex gap-8 max-lg:h-full lg:w-full lg:flex-col">
        <div className="flex items-center justify-center">
          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="transition-opacity duration-150 ease-linear hover:opacity-50"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <div className="flex items-center justify-center border-[#494E6E] max-lg:h-full max-lg:border-l max-lg:px-6 lg:border-t lg:py-6">
          <img src={avatar} alt="User avatar" className="size-10 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
