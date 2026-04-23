import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      type="button"
      aria-label="Go back to previous page"
      className="flex items-center gap-x-4" 
      onClick={() => navigate(-1)}
    >
      <ChevronLeftIcon />
      <span className="text-08 heading-s-variant dark:text-white">Go back</span>
    </button>
  );
};

export default BackButton;
