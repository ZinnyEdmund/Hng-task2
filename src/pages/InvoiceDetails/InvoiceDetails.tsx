import type { Invoice } from "@/types";
import dayjs from "dayjs";
import { useMediaQuery } from "react-responsive";

const InvoiceDetails = ({ invoice }: { invoice: Invoice }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <article className="dark:bg-03 rounded-lg bg-white p-12 max-lg:p-8 max-md:p-6">
      <div className="mb-5 flex gap-y-7.5 max-md:mb-7.5 max-md:flex-col md:items-start md:justify-between">
        <div className="space-y-1.75">
          <p className="heading-s-variant">
            <span className="text-07 dark:text-05">#</span> {invoice.id}
          </p>
          <p className="text-07 body-variant dark:text-05">
            {invoice.description}
          </p>
        </div>
        <div className="text-right max-md:text-left">
          <p className="text-07 body dark:text-05">
            {invoice.senderAddress.street}
          </p>
          <p className="text-07 body dark:text-05">
            {invoice.senderAddress.city}
          </p>
          <p className="text-07 body dark:text-05">
            {invoice.senderAddress.postCode}
          </p>
          <p className="text-07 body dark:text-05">
            {invoice.senderAddress.country}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[194fr_203fr_253fr] items-start gap-y-8 max-md:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-07 body-variant dark:text-05">Invoice date</p>
            <p className="text-08 heading-s dark:text-white">
              {dayjs(invoice.createdAt).format("DD MMM YYYY")}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-07 body-variant dark:text-05">Payment due</p>
            <p className="text-08 heading-s dark:text-white">
              {dayjs(invoice.paymentDue).format("DD MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-07 body-variant dark:text-05">Bill to</p>
          <div className="space-y-1.75">
            <p className="text-08 heading-s dark:text-white">
              {invoice.clientName}
            </p>
            <div className="text-left">
              <p className="text-07 body dark:text-05">
                {invoice.clientAddress.street}
              </p>
              <p className="text-07 body dark:text-05">
                {invoice.clientAddress.city}
              </p>
              <p className="text-07 body dark:text-05">
                {invoice.clientAddress.postCode}
              </p>
              <p className="text-07 body dark:text-05">
                {invoice.clientAddress.country}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3 max-md:col-span-2">
          <p className="text-07 body-variant dark:text-05">Sent to</p>
          <p className="text-08 heading-s dark:text-white">
            {invoice.clientEmail}
          </p>
        </div>
      </div>

      <div className="dark:bg-04 mt-11 rounded-t-lg bg-[#F9FAFE] p-8 max-md:mt-9 max-md:p-6">
        <table className="w-full" aria-label="Invoice items">
          {!isMobile && (
            <colgroup>
              <col className="w-[52%]" />
              <col className="w-[0.05%]" />
              <col className="w-[23.95%]" />
              <col className="w-[24%]" />
            </colgroup>
          )}
          {!isMobile && (
            <thead>
              <tr>
                <th className="text-07 dark:text-05 body pb-4 text-left">
                  Item Name
                </th>
                <th className="text-07 dark:text-05 body pb-4 text-right">
                  QTY.
                </th>
                <th className="text-07 dark:text-05 body pb-4 text-right">
                  Price
                </th>
                <th className="text-07 dark:text-05 body pb-4 text-right">
                  Total
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                {!isMobile && (
                  <td className="heading-s-variant text-08 py-4 text-left dark:text-white">
                    {item.name}
                  </td>
                )}
                {isMobile && (
                  <td className="py-4 text-left">
                    <div className="space-y-2">
                      <p className="heading-s-variant text-08 dark:text-white">
                        {item.name}
                      </p>
                      <p className="heading-s-variant text-07 dark:text-05">
                        {item.quantity} x £ {item.price}
                      </p>
                    </div>
                  </td>
                )}
                {!isMobile && (
                  <>
                    {" "}
                    <td className="heading-s-variant text-07 dark:text-05 py-4 text-right">
                      {item.quantity}
                    </td>
                    <td className="heading-s-variant text-07 dark:text-05 py-4 text-right">
                      £ {item.price}
                    </td>
                  </>
                )}
                <td className="heading-s-variant text-08 py-4 text-right dark:text-white">
                  £ {item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dark:bg-08 flex items-center justify-between rounded-b-lg bg-[#373B53] px-8 py-5 text-white">
        <span className="body">{isMobile ? "Grand Total" : "Amount Due"}</span>
        <span className="heading-m">£ {invoice.total.toFixed(2)}</span>
      </div>
    </article>
  );
};

export default InvoiceDetails;
