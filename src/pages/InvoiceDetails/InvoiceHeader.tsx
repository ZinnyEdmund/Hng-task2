import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";

interface InvoiceHeaderProps {
  invoice: Invoice;
  onEdit: () => void;
  onDelete: () => void;
  onMarkAsPaid: () => void;
}

const InvoiceHeader = ({ invoice, onEdit, onDelete, onMarkAsPaid }: InvoiceHeaderProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/${invoice.id}/edit`);
  };

  return (
    <>
      <header className="dark:bg-03 mt-7.5 mb-6 flex items-center justify-between rounded-lg bg-white px-8 py-6 max-md:mb-4 max-md:px-6">
        <div className="flex items-center justify-start gap-x-5 max-md:w-full max-md:justify-between">
          <p className="text-06 dark:text-05 body-variant">Status</p>
          <div
            className={cn(
              "heading-s-variant flex h-10 w-26 items-center justify-center gap-x-2 rounded-md px-2 capitalize",
              invoice.status === "paid" && "bg-[#33D69F]/6 text-[#33D69F]",
              invoice.status === "pending" && "bg-[#FF8F00]/6 text-[#FF8F00]",
              invoice.status === "draft" && "bg-[#373B53]/6 text-[#373B53]",
            )}
          >
            <div
              className={cn(
                "size-2 rounded-full",
                invoice.status === "paid" && "bg-[#33D69F]",
                invoice.status === "pending" && "bg-[#FF8F00]",
                invoice.status === "draft" && "bg-[#373B53]",
              )}
            />
            {invoice.status}
          </div>
        </div>
        {!isMobile && (
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="button-3" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="button-5" onClick={onDelete}>
              Delete
            </Button>
            {invoice.status === "pending" && (
              <Button variant="button-2" onClick={onMarkAsPaid}>Mark as paid</Button>
            )}
          </div>
        )}
      </header>
      {isMobile && (
        <div className="dark:bg-03 fixed bottom-0 left-0 w-full bg-white px-6 py-5">
          <div className="flex items-center gap-x-2">
            <Button variant="button-3" onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="button-5" onClick={onDelete}>
              Delete
            </Button>
            {invoice.status === "pending" && (
              <Button variant="button-2" onClick={onMarkAsPaid}>Mark as paid</Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceHeader;
