import TrashIcon from "@/assets/icons/TrashIcon";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
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
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { Navigate, useNavigate } from "react-router";

const CreateInvoice = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [hasScrolled, setHasScrolled] = useState(false);
  const navigate = useNavigate();
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

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchItems = watch("items");

  useEffect(() => {
    watchItems.forEach((item, index) => {
      const computed = calculateItemTotal(item.quantity || 0, item.price || 0);
      if (item.total !== computed) {
        setValue(`items.${index}.total`, computed);
      }
    });
  }, [watchItems, setValue]);

  useEffect(() => {
    if (isMobile) {
      document.body.className =
        "bg-white text-neutral-dark dark:bg-dark-bg font-sans antialiased dark:text-white";
    }

    const handleWindowScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      document.body.className =
        "bg-accent-bg text-neutral-dark dark:bg-dark-bg font-sans antialiased dark:text-white";
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [isMobile]);

  if (!isMobile) return <Navigate to="/" replace />;

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
    createInvoice(buildInvoice(data, "pending"));
    reset();
    navigate("/");
  };

  const handleSaveAsDraft = () => {
    const data = getValues();
    const id = generateInvoiceId(invoices.map((i) => i.id));
    const createdAt = data.createdAt
      ? dayjs(data.createdAt).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    const paymentTerms = data.paymentTerms || 30;
    const items = (data.items || []).map((item) => ({
      name: item.name || "",
      quantity: item.quantity || 0,
      price: item.price || 0,
      total: calculateItemTotal(item.quantity || 0, item.price || 0),
    }));
    const invoice: Invoice = {
      id,
      createdAt,
      paymentDue: calculatePaymentDue(createdAt, paymentTerms),
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
      total: calculateInvoiceTotal(items),
    };
    createInvoice(invoice);
    reset();
    navigate("/");
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <main className="max-md:pb-16">
        <BackButton />
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-08 heading-m mb-5 dark:text-white">
            New Invoice
          </h2>

          <div className="mb-9">
            <h4 className="text-01 heading-s-variant mb-6">Bill From</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="m-from-streetAddress"
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
                  id="m-from-streetAddress"
                  {...register("senderAddress.street")}
                  error={!!errors.senderAddress?.street}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="m-from-city"
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
                    id="m-from-city"
                    {...register("senderAddress.city")}
                    error={!!errors.senderAddress?.city}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="m-from-postCode"
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
                    id="m-from-postCode"
                    {...register("senderAddress.postCode")}
                    error={!!errors.senderAddress?.postCode}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label
                    htmlFor="m-from-country"
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
                    id="m-from-country"
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
                  htmlFor="m-clientName"
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
                  id="m-clientName"
                  {...register("clientName")}
                  error={!!errors.clientName}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="m-clientEmail"
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
                  id="m-clientEmail"
                  {...register("clientEmail")}
                  error={!!errors.clientEmail}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="m-to-streetAddress"
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
                  id="m-to-streetAddress"
                  {...register("clientAddress.street")}
                  error={!!errors.clientAddress?.street}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="m-to-city"
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
                    id="m-to-city"
                    {...register("clientAddress.city")}
                    error={!!errors.clientAddress?.city}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="m-to-postCode"
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
                    id="m-to-postCode"
                    {...register("clientAddress.postCode")}
                    error={!!errors.clientAddress?.postCode}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label
                    htmlFor="m-to-country"
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
                    id="m-to-country"
                    {...register("clientAddress.country")}
                    error={!!errors.clientAddress?.country}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-14 grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="m-invoiceDate"
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
                    id="m-invoiceDate"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="m-paymentTerms"
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
                    id="m-paymentTerms"
                    value={String(field.value)}
                    onChange={(v) => field.onChange(Number(v))}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="m-projectDescription"
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
                id="m-projectDescription"
                {...register("description")}
                error={!!errors.description}
              />
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-6 text-[18px] leading-8 font-bold text-[#777F98]">
              Item List
            </h4>
            <div className="space-y-11">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor={`m-item-${index}-name`}
                      className="flex items-center justify-between"
                    >
                      <span
                        className={cn(
                          "text-07 body-variant dark:text-05",
                          errors.items?.[index]?.name && "text-09",
                        )}
                      >
                        Item Name
                      </span>
                    </label>
                    <Input
                      type="text"
                      id={`m-item-${index}-name`}
                      {...register(`items.${index}.name`)}
                      error={!!errors.items?.[index]?.name}
                    />
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div className="w-[19.6%] space-y-2">
                      <label
                        htmlFor={`m-item-${index}-qty`}
                        className="flex items-center justify-between"
                      >
                        <span
                          className={cn("text-07 body-variant dark:text-05")}
                        >
                          Qty.
                        </span>
                      </label>
                      <Input
                        type="number"
                        id={`m-item-${index}-qty`}
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        error={!!errors.items?.[index]?.quantity}
                      />
                    </div>
                    <div className="w-[30.6%] space-y-2">
                      <label
                        htmlFor={`m-item-${index}-price`}
                        className="flex items-center justify-between"
                      >
                        <span
                          className={cn("text-07 body-variant dark:text-05")}
                        >
                          Price
                        </span>
                      </label>
                      <Input
                        type="number"
                        id={`m-item-${index}-price`}
                        step="0.01"
                        {...register(`items.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        error={!!errors.items?.[index]?.price}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-07 body-variant dark:text-05">Total</p>
                      <div className="flex h-12 items-center justify-start">
                        <span className="text-06 heading-s-variant">
                          {(watchItems[index]?.total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p></p>
                      <div className="flex h-12 items-center justify-end">
                        <button
                          type="button"
                          className="transition-opacity duration-150 ease-linear hover:opacity-50"
                          onClick={() => {
                            if (fields.length > 1) remove(index);
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="button-6"
            type="button"
            onClick={() =>
              append({ name: "", quantity: 0, price: 0, total: 0 })
            }
          >
            + Add New Item
          </Button>
        </form>
        <div className="mt-8 mb-16">
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
      </main>
      <div
        className={cn(
          "dark:bg-12 fixed right-0 bottom-0 left-0 z-40 flex items-center gap-x-2 rounded-tr-2xl bg-white px-6 py-8",
          hasScrolled && "shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.1)]",
        )}
      >
        <Button variant="button-3" type="button" onClick={() => navigate(-1)}>
          Discard
        </Button>

        <Button variant="button-4" type="button" onClick={handleSaveAsDraft}>
          Save as draft
        </Button>
        <Button
          variant="button-2"
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          Save & Send
        </Button>
      </div>
    </>
  );
};

export default CreateInvoice;
