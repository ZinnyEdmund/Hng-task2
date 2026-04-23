import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useInvoices } from "../hooks/useInvoices";
import type { Invoice } from "../types";

interface InvoiceContextType {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filterStatuses: string[];
  setFilterStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  createInvoice: (invoice: Invoice) => boolean;
  updateInvoice: (id: string, invoice: Invoice) => boolean;
  deleteInvoice: (id: string) => boolean;
  getInvoiceById: (id: string) => Invoice | undefined;
  markAsPaid: (id: string) => boolean;
  error: string | null;
}

const InvoiceContext = createContext<InvoiceContextType | null>(null);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const {
    invoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    error,
  } = useInvoices();
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

  const filteredInvoices = useMemo(() => {
    const list = filterStatuses.length === 0
      ? invoices
      : invoices.filter((inv) => filterStatuses.includes(inv.status));
    
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [invoices, filterStatuses]);

  const markAsPaid = (id: string): boolean => {
    const invoice = getInvoiceById(id);
    if (!invoice) return false;
    return updateInvoice(id, { ...invoice, status: "paid" });
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        filteredInvoices,
        filterStatuses,
        setFilterStatuses,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        markAsPaid,
        error,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error(
      "useInvoiceContext must be used within an InvoiceProvider",
    );
  }
  return context;
}
