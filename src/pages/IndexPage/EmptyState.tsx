import image from "@/assets/images/email-campaign.png";

const EmptyState = () => {
  return (
    <div className="ite mx-auto mt-35 mb-37.5 flex max-w-60.5 flex-col gap-y-16.5 text-center max-md:mt-25">
      <img src={image} alt="No invoices illustration" className="w-full object-contain" />
      <div className="space-y-5">
        <h3 className="heading-m">There is nothing here</h3>
        <p className="text-06 body-variant dark:text-05">
          Create an invoice by clicking the{" "}
          <span className="font-bold">New Invoice</span> button and get started
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
