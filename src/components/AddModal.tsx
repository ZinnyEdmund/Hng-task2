import TrashIcon from "@/assets/icons/TrashIcon";
import { useInvoiceContext } from "@/context/InvoiceContext";
import type { InvoiceFormData } from "@/lib/schemas";
import { InvoiceFormSchema } from "@/lib/schemas";
import {
  calculateInvoiceTotal,
  calculateItemTotal,
  calculatePaymentDue,
  cn,
  generateInvoiceId,
} from "@/lib/utils";
import type { Invoice } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Button from "./Button";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Select from "./Select";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddModal = ({ isOpen, onClose }: AddModalProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const modalRef = useRef<HTMLFormElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { createInvoice, invoices } = useInvoiceContext();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues: {
      createdAt: new Date(),
      senderAddress: { street: "", city: "", postCode: "", country: "" },
      clientAddress: { street: "", city: "", postCode: "", country: "" },
      clientName: "",
      clientEmail: "",
      description: "",
      paymentTerms: 30,
      items: [{ name: "", quantity: 0, price: 0, total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // Compute item totals when quantity/price change
  useEffect(() => {
    watchItems.forEach((item, index) => {
      const computed = calculateItemTotal(item.quantity || 0, item.price || 0);
      if (item.total !== computed) {
        setValue(`items.${index}.total`, computed);
      }
    });
  }, [watchItems, setValue]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setHasScrolled(e.currentTarget.scrollTop > 0);
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const buildInvoice = (
    data: InvoiceFormData,
    status: "pending" | "draft",
  ): Invoice => {
    const id = generateInvoiceId(invoices.map((i) => i.id));
    const createdAt = dayjs(data.createdAt).format("YYYY-MM-DD");
    const paymentDue = calculatePaymentDue(createdAt, data.paymentTerms);
    const items = data.items.map((item) => ({
      ...item,
      total: calculateItemTotal(item.quantity || 0, item.price || 0),
    }));
    const total = calculateInvoiceTotal(items);

    return {
      id,
      createdAt,
      paymentDue,
      description: data.description,
      paymentTerms: data.paymentTerms,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      status,
      senderAddress: data.senderAddress,
      clientAddress: data.clientAddress,
      items,
      total,
    };
  };

  const onSubmit = (data: InvoiceFormData) => {
    const invoice = buildInvoice(data, "pending");
    createInvoice(invoice);
    reset();
    onClose();
  };

  const handleSaveAsDraft = () => {
    const data = getValues();
    const id = generateInvoiceId(invoices.map((i) => i.id));
    const createdAt = data.createdAt
      ? dayjs(data.createdAt).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    const paymentTerms = data.paymentTerms || 30;
    const paymentDue = calculatePaymentDue(createdAt, paymentTerms);
    const items = (data.items || []).map((item) => ({
      name: item.name || "",
      quantity: item.quantity || 0,
      price: item.price || 0,
      total: calculateItemTotal(item.quantity || 0, item.price || 0),
    }));
    const total = calculateInvoiceTotal(items);

    const invoice: Invoice = {
      id,
      createdAt,
      paymentDue,
      description: data.description || "",
      paymentTerms,
      clientName: data.clientName || "",
      clientEmail: data.clientEmail || "",
      status: "draft",
      senderAddress: {
        street: data.senderAddress?.street || "",
        city: data.senderAddress?.city || "",
        postCode: data.senderAddress?.postCode || "",
        country: data.senderAddress?.country || "",
      },
      clientAddress: {
        street: data.clientAddress?.street || "",
        city: data.clientAddress?.city || "",
        postCode: data.clientAddress?.postCode || "",
        country: data.clientAddress?.country || "",
      },
      items,
      total,
    };

    createInvoice(invoice);
    reset();
    onClose();
  };

  const handleDiscard = () => {
    reset();
    onClose();
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
      className={cn(
        "fixed inset-0 z-99 flex bg-black/50 transition-all duration-500 ease-in-out",
        isOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        ref={modalRef}
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "dark:bg-12 grid h-full w-full max-w-179.75 grid-rows-[1fr_auto] overflow-hidden rounded-r-2xl bg-white pb-0 transition-transform duration-500 ease-in-out max-lg:max-w-154",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onScroll={handleScroll}
          className={cn("overflow-y-auto px-13 pt-13 lg:pl-38.75")}
        >
          <h2
            id="add-modal-title"
            className="text-08 heading-m mb-11 dark:text-white"
          >
            New Invoice
          </h2>

          <div className="mb-12">
            <h4 className="text-01 heading-s-variant mb-6">Bill From</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="from-streetAddress"
                  className="flex items-center justify-between"
                >
                  <span
                    className={cn(
                      "text-07 body-variant dark:text-05",
                      errors.senderAddress?.street && "text-09",
                    )}
                  >
                    Street Address
                  </span>
                  {errors.senderAddress?.street && (
                    <span className="text-09 text-[10px] leading-3.75 font-semibold tracking-[-0.21px]">
                      can't be empty
                    </span>
                  )}
                </label>
                <Input
                  type="text"
                  id="from-streetAddress"
                  {...register("senderAddress.street")}
                  error={!!errors.senderAddress?.street}
                />
              </div>
              <div className="grid grid-cols-3 gap-x-6">
                <div className="space-y-2">
                  <label
                    htmlFor="from-city"
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-07 body-variant dark:text-05",
                        errors.senderAddress?.city && "text-09",
                      )}
                    >
                      City
                    </span>
                  </label>
                  <Input
                    type="text"
                    id="from-city"
                    {...register("senderAddress.city")}
                    error={!!errors.senderAddress?.city}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="from-postCode"
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-07 body-variant dark:text-05",
                        errors.senderAddress?.postCode && "text-09",
                      )}
                    >
                      Post Code
                    </span>
                  </label>
                  <Input
                    type="text"
                    id="from-postCode"
                    {...register("senderAddress.postCode")}
                    error={!!errors.senderAddress?.postCode}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="from-country"
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-07 body-variant dark:text-05",
                        errors.senderAddress?.country && "text-09",
                      )}
                    >
                      Country
                    </span>
                  </label>
                  <Input
                    type="text"
                    id="from-country"
                    {...register("senderAddress.country")}
                    error={!!errors.senderAddress?.country}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-9">
            <h4 className="text-01 heading-s-variant mb-6">Bill To</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="clientName"
                  className="flex items-center justify-between"
                >
                  <span
                    className={cn(
                      "text-07 body-variant dark:text-05",
                      errors.clientName && "text-09",
                    )}
                  >
                    Client's Name
                  </span>
                  {errors.clientName && (
                    <span className="text-09 text-[10px] leading-3.75 font-semibold tracking-[-0.21px]">
                      can't be empty
                    </span>
                  )}
                </label>
                <Input
                  type="text"
                  id="clientName"
                  {...register("clientName")}
                  error={!!errors.clientName}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="clientEmail"
                  className="flex items-center justify-between"
                >
                  <span
                    className={cn(
                      "text-07 body-variant dark:text-05",
                      errors.clientEmail && "text-09",
                    )}
                  >
                    Client's Email
                  </span>
                  {errors.clientEmail && (
                    <span className="text-09 text-[10px] leading-3.75 font-semibold tracking-[-0.21px]">
                      {errors.clientEmail.message}
                    </span>
                  )}
                </label>
                <Input
                  type="email"
                  id="clientEmail"
                  {...register("clientEmail")}
                  error={!!errors.clientEmail}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="to-streetAddress"
                  className="flex items-center justify-between"
                >
                  <span
                    className={cn(
                      "text-07 body-variant dark:text-05",
                      errors.clientAddress?.street && "text-09",
                    )}
                  >
                    Street Address
                  </span>
                  {errors.clientAddress?.street && (
                    <span className="text-09 text-[10px] leading-3.75 font-semibold tracking-[-0.21px]">
                      can't be empty
                    </span>
                  )}
                </label>
                <Input
                  type="text"
                  id="to-streetAddress"
                  {...register("clientAddress.street")}
                  error={!!errors.clientAddress?.street}
                />
              </div>
              <div className="grid grid-cols-3 gap-x-6">
                <div className="space-y-2">
                  <label
                    htmlFor="to-city"
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-07 body-variant dark:text-05",
                        errors.clientAddress?.city && "text-09",
                      )}
                    >
                      City
                    </span>
                  </label>
                  <Input
                    type="text"
                    id="to-city"
                    {...register("clientAddress.city")}
                    error={!!errors.clientAddress?.city}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="to-postCode"
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-07 body-variant dark:text-05",
                        errors.clientAddress?.postCode && "text-09",
                      )}
                    >
                      Post Code
                    </span>
                  </label>
                  <Input
                    type="text"
                    id="to-postCode"
                    {...register("clientAddress.postCode")}
                    error={!!errors.clientAddress?.postCode}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="to-country"
                    className="flex items-center justify-between"
                  >
                    <span
                      className={cn(
                        "text-07 body-variant dark:text-05",
                        errors.clientAddress?.country && "text-09",
                      )}
                    >
                      Country
                    </span>
                  </label>
                  <Input
                    type="text"
                    id="to-country"
                    {...register("clientAddress.country")}
                    error={!!errors.clientAddress?.country}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="invoiceDate"
                className="flex items-center justify-between"
              >
                <span className={cn("text-07 body-variant dark:text-05")}>
                  Invoice Date
                </span>
              </label>
              <Controller
                name="createdAt"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="invoiceDate"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="paymentTerms"
                className="flex items-center justify-between"
              >
                <span className={cn("text-07 body-variant dark:text-05")}>
                  Payment Terms
                </span>
              </label>
              <Controller
                name="paymentTerms"
                control={control}
                render={({ field }) => (
                  <Select
                    id="paymentTerms"
                    value={String(field.value)}
                    onChange={(v) => field.onChange(Number(v))}
                  />
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="projectDescription"
                className="flex items-center justify-between"
              >
                <span
                  className={cn(
                    "text-07 body-variant dark:text-05",
                    errors.description && "text-09",
                  )}
                >
                  Project Description
                </span>
                {errors.description && (
                  <span className="text-09 text-[10px] leading-3.75 font-semibold tracking-[-0.21px]">
                    can't be empty
                  </span>
                )}
              </label>
              <Input
                type="text"
                id="projectDescription"
                {...register("description")}
                error={!!errors.description}
              />
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-[18px] leading-8 font-bold text-[#777F98]">
              Item List
            </h4>
            <table className="w-full">
              <colgroup>
                <col className="w-[45.6%]" />
                <col className="w-[12.3%]" />
                <col className="w-[23%]" />
                <col className="w-[16.4%]" />
                <col className="w-auto" />
              </colgroup>
              <thead>
                <tr>
                  <th className="body-variant text-07 dark:text-05 text-left">
                    Item Name
                  </th>
                  <th className="body-variant text-07 dark:text-05 text-left">
                    Qty.
                  </th>
                  <th className="body-variant text-07 dark:text-05 text-left">
                    Price
                  </th>
                  <th className="body-variant text-07 dark:text-05 text-left">
                    Total
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="py-4.5 pr-4">
                      <label htmlFor={`item-${index}-name`} className="sr-only">
                        Item {index + 1} Name
                      </label>
                      <Input
                        type="text"
                        id={`item-${index}-name`}
                        {...register(`items.${index}.name`)}
                        error={!!errors.items?.[index]?.name}
                      />
                    </td>
                    <td className="py-4.5 pr-4">
                      <label htmlFor={`item-${index}-qty`} className="sr-only">
                        Item {index + 1} Quantity
                      </label>
                      <Input
                        type="number"
                        id={`item-${index}-qty`}
                        className="px-2"
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        error={!!errors.items?.[index]?.quantity}
                      />
                    </td>
                    <td className="py-4.5 pr-4">
                      <label
                        htmlFor={`item-${index}-price`}
                        className="sr-only"
                      >
                        Item {index + 1} Price
                      </label>
                      <Input
                        type="number"
                        id={`item-${index}-price`}
                        className="px-2"
                        step="0.01"
                        {...register(`items.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        error={!!errors.items?.[index]?.price}
                      />
                    </td>
                    <td>
                      <span
                        className="text-06 heading-s-variant"
                        aria-label={`Item ${index + 1} Total`}
                      >
                        {(watchItems[index]?.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="transition-opacity duration-150 ease-linear hover:opacity-50"
                        aria-label={`Delete item ${index + 1}`}
                        onClick={() => {
                          if (fields.length > 1) remove(index);
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              variant="button-6"
              type="button"
              onClick={() =>
                append({ name: "", quantity: 0, price: 0, total: 0 })
              }
            >
              + Add New Item
            </Button>
          </div>
          <div className="my-8">
            {hasErrors && (
              <>
                <p className="text-09 text-[10px] leading-3.75 font-semibold">
                  - All fields must be added
                </p>
                {errors.items?.root && (
                  <p className="text-09 text-[10px] leading-3.75 font-semibold">
                    - An item must be added
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-between rounded-tr-2xl px-13 py-8 lg:pl-38.75",
            hasScrolled && "shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.1)]",
          )}
        >
          <Button variant="button-3" type="button" onClick={handleDiscard}>
            Discard
          </Button>
          <div className="flex items-center gap-x-2">
            <Button
              variant="button-4"
              type="button"
              onClick={handleSaveAsDraft}
            >
              Save as draft
            </Button>
            <Button variant="button-2" type="submit">
              Save & Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddModal;
