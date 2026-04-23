import AddModal from "@/components/AddModal";
import { useState } from "react";
import Header from "./Header";
import InvoiceList from "./InvoiceList";

export default function IndexPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
      <Header onOpen={() => setIsModalOpen(true)} />
      {/* <EmptyState /> */}
      <InvoiceList />
      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
