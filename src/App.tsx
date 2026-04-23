import { Outlet, ScrollRestoration } from "react-router";
import Sidebar from "./components/Sidebar";
import { InvoiceProvider } from "./context/InvoiceContext";

const App = () => {
  return (
    <InvoiceProvider>
      <div className="flex min-h-screen grid-rows-[auto_1fr] max-lg:grid lg:h-screen lg:overflow-hidden">
        <Sidebar />

        <div className="relative flex-1 pt-19.25 pb-6 max-lg:pt-15 max-md:pt-8 lg:overflow-y-auto">
          <div className="mx-auto w-full max-w-194.5 px-6 md:px-12">
            <ScrollRestoration />
            <Outlet />
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
};

export default App;
