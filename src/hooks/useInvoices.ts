import { useState, useEffect, useCallback } from "react";
import type { Invoice } from "../types";
import initialData from "../lib/data.json";

const STORAGE_KEY = "invoices";

interface UseInvoicesReturn {
  invoices: Invoice[];
  getInvoices: () => Invoice[];
  getInvoiceById: (id: string) => Invoice | undefined;
  createInvoice: (invoice: Invoice) => boolean;
  updateInvoice: (id: string, invoice: Invoice) => boolean;
  deleteInvoice: (id: string) => boolean;
  error: string | null;
}

export function useInvoices(): UseInvoicesReturn {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize invoices from LocalStorage or data.json
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setInvoices(parsed);
      } else {
        // First load: initialize from data.json
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        setInvoices(initialData as Invoice[]);
      }
      setError(null);
    } catch (err) {
      if (err instanceof SyntaxError) {
        // Parse error: clear corrupted data and reinitialize
        console.error("LocalStorage parse error, reinitializing from data.json");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        setInvoices(initialData as Invoice[]);
        setError("Data was corrupted and has been reset");
      } else {
        console.error("LocalStorage access error:", err);
        setInvoices(initialData as Invoice[]);
        setError("Unable to access storage, operating in memory-only mode");
      }
    }
  }, []);

  // Helper function to safely write to LocalStorage
  const safeLocalStorageSet = useCallback((data: Invoice[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        console.error("LocalStorage quota exceeded");
        setError("Storage quota exceeded. Unable to save changes.");
      } else {
        console.error("LocalStorage write error:", err);
        setError("Unable to save changes to storage");
      }
      return false;
    }
  }, []);

  // Get all invoices
  const getInvoices = useCallback((): Invoice[] => {
    return invoices;
  }, [invoices]);

  // Get invoice by ID
  const getInvoiceById = useCallback((id: string): Invoice | undefined => {
    return invoices.find((invoice) => invoice.id === id);
  }, [invoices]);

  // Create new invoice
  const createInvoice = useCallback((invoice: Invoice): boolean => {
    const updatedInvoices = [...invoices, invoice];
    
    if (safeLocalStorageSet(updatedInvoices)) {
      setInvoices(updatedInvoices);
      return true;
    }
    return false;
  }, [invoices, safeLocalStorageSet]);

  // Update existing invoice
  const updateInvoice = useCallback((id: string, invoice: Invoice): boolean => {
    const index = invoices.findIndex((inv) => inv.id === id);
    
    if (index === -1) {
      setError(`Invoice with ID ${id} not found`);
      return false;
    }

    const updatedInvoices = [...invoices];
    updatedInvoices[index] = invoice;
    
    if (safeLocalStorageSet(updatedInvoices)) {
      setInvoices(updatedInvoices);
      return true;
    }
    return false;
  }, [invoices, safeLocalStorageSet]);

  // Delete invoice
  const deleteInvoice = useCallback((id: string): boolean => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    
    if (updatedInvoices.length === invoices.length) {
      setError(`Invoice with ID ${id} not found`);
      return false;
    }

    if (safeLocalStorageSet(updatedInvoices)) {
      setInvoices(updatedInvoices);
      return true;
    }
    return false;
  }, [invoices, safeLocalStorageSet]);

  return {
    invoices,
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    error,
  };
}
