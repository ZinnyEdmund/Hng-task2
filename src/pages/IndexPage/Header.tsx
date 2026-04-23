import Button from "@/components/Button";
import { useInvoiceContext } from "@/context/InvoiceContext";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";
import StatusFilter from "./StatusFilter";

interface HeaderProps {
  onOpen: () => void;
}

const Header = ({ onOpen }: HeaderProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { filteredInvoices } = useInvoiceContext();

  const navigate = useNavigate();

  const handleNewInvoiceClick = () => {
    if (isMobile) navigate("/new");
    else onOpen();
  };

  const count = filteredInvoices.length;

  return (
    <header className="flex items-center justify-between gap-x-8">
      <div className="space-y-1.5 max-md:space-y-0.75">
        <h1 className="heading-l">Invoices</h1>
        <p className="text-highlight body">
          {isMobile
            ? `${count} Invoice${count !== 1 ? "s" : ""}`
            : count === 0
              ? "No invoices"
              : `There are ${count} total invoice${count !== 1 ? "s" : ""}`}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-end max-md:gap-x-4">
        <StatusFilter />
        <Button variant="button-1" onClick={handleNewInvoiceClick}>
          {isMobile ? "New" : "New Invoice"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
