import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import type { InvoiceItem } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInvoiceId(existingIds: string[] = []): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  let id: string;
  do {
    const letter1 = letters[Math.floor(Math.random() * 26)];
    const letter2 = letters[Math.floor(Math.random() * 26)];
    const nums = Array.from({ length: 4 }, () => 
      digits[Math.floor(Math.random() * 10)]
    ).join('');
    id = `${letter1}${letter2}${nums}`;
  } while (existingIds.includes(id));
  
  return id;
}

export function calculatePaymentDue(createdAt: string, paymentTerms: number): string {
  return dayjs(createdAt).add(paymentTerms, 'day').format('YYYY-MM-DD');
}

export function calculateItemTotal(quantity: number, price: number): number {
  return Number((quantity * price).toFixed(2));
}

export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return Number(
    items.reduce((sum, item) => sum + item.total, 0).toFixed(2)
  );
}
