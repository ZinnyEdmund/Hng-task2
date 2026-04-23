import App from "@/App";
import CreateInvoice from "@/pages/CreateInvoice";
import EditInvoice from "@/pages/EditInvoice";
import IndexPage from "@/pages/IndexPage";
import EmptyState from "@/pages/IndexPage/EmptyState";
import InvoiceDetails from "@/pages/InvoiceDetails";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: IndexPage },
      { path: "new", Component: CreateInvoice },
      { path: "/:id", Component: InvoiceDetails },
      { path: "/:id/edit", Component: EditInvoice },
      { path: "*", Component: EmptyState },
    ],
  },
]);

export default router;
