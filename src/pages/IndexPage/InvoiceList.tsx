import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import { useInvoiceContext } from "@/context/InvoiceContext";
import { cn } from "@/lib/utils";
import type { Invoice as InvoiceType } from "@/types";
import dayjs from "dayjs";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router";
import EmptyState from "./EmptyState";

const Invoice = ({ invoice }: { invoice: InvoiceType }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return (
      <Link
        to={`/${invoice.id}`}
        aria-label={`View invoice ${invoice.id} for ${invoice.clientName}`}
        className="hover:border-01 dark:bg-03 block cursor-pointer space-y-6 rounded-lg border border-transparent bg-white p-6 transition-colors duration-150 ease-linear"
      >
        <div className="flex items-center justify-between">
          <p className="heading-s-variant">
            <span className="text-07">#</span> {invoice.id}
          </p>
          <p className="body-variant text-06">{invoice.clientName}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="body-variant text-06">
              Due {dayjs(invoice.paymentDue).format("DD MMM YYYY")}
            </p>
            <p className="text-08 heading-s dark:text-white">
              £ {invoice.total.toFixed(2)}
            </p>
          </div>
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
      </Link>
    );
  }

  return (
    <Link
      to={`/${invoice.id}`}
      aria-label={`View invoice ${invoice.id} for ${invoice.clientName}`}
      className="hover:border-01 dark:bg-03 flex cursor-pointer items-center justify-between rounded-lg border border-transparent bg-white p-8 transition-colors duration-150 ease-linear max-lg:py-6"
    >
      <div className="flex items-center justify-start">
        <p className="heading-s-variant mr-11">
          <span className="text-07">#</span> {invoice.id}
        </p>
        <p className="body-variant text-06 mr-14">
          Due {dayjs(invoice.paymentDue).format("DD MMM YYYY")}
        </p>
        <p className="body-variant text-06">{invoice.clientName}</p>
      </div>
      <div className="flex items-center justify-end">
        <p className="text-08 heading-s mr-10 dark:text-white">
          £ {invoice.total.toFixed(2)}
        </p>
        <div
          className={cn(
            "heading-s-variant mr-5 flex h-10 w-26 items-center justify-center gap-x-2 rounded-md px-2 capitalize",
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
        <ChevronRightIcon />
      </div>
    </Link>
  );
};

const InvoiceList = () => {
  const { filteredInvoices } = useInvoiceContext();

  if (filteredInvoices.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="mt-16 space-y-4" aria-label="Invoice list">
      {filteredInvoices.map((invoice) => (
        <li key={invoice.id}>
          <Invoice invoice={invoice} />
        </li>
      ))}
    </ul>
  );
};

export default InvoiceList;
