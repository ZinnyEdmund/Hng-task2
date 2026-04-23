import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postCode: z.string().min(1, "Post code is required"),
  country: z.string().min(1, "Country is required"),
});

export const InvoiceItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  total: z.number(),
});

export const InvoiceFormSchema = z.object({
  createdAt: z.date({ error: "Invoice date is required" }),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email format"),
  senderAddress: AddressSchema,
  clientAddress: AddressSchema,
  paymentTerms: z.number().refine((val) => [1, 7, 14, 30].includes(val), {
    message: "Payment terms must be 1, 7, 14, or 30 days",
  }),
  description: z.string().min(1, "Description is required"),
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
});

export type Address = z.infer<typeof AddressSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceFormData = z.infer<typeof InvoiceFormSchema>;
