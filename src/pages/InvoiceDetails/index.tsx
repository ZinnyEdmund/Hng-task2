import BackButton from "@/components/BackButton";
import DeleteModal from "@/components/DeleteModal";
import EditModal from "@/components/EditModal";
import { useInvoiceContext } from "@/context/InvoiceContext";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import EmptyState from "../IndexPage/EmptyState";
import InvDetails from "./InvoiceDetails";
import InvoiceHeader from "./InvoiceHeader";

const InvoiceDetails = () => {
  const params = useParams() as { id: string };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { getInvoiceById, deleteInvoice, markAsPaid } = useInvoiceContext();
  const navigate = useNavigate();

  const invoice = getInvoiceById(params.id);

  if (!invoice) return <EmptyState />;

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    setIsDeleteModalOpen(false);
    navigate("/");
  };

  const handleMarkAsPaid = () => {
    markAsPaid(invoice.id);
  };

  return (
    <main className="max-md:pb-16">
      <BackButton />
      <InvoiceHeader
        invoice={invoice}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        onMarkAsPaid={handleMarkAsPaid}
      />
      <InvDetails invoice={invoice} />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        invoice={invoice}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        invoiceId={invoice.id}
        onConfirm={handleDelete}
      />
    </main>
  );
};

export default InvoiceDetails;
