import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdMenu } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa6";

import { fetchInvoices } from "../../src/features/invoice/invoiceSlice";
import { useSidebar } from "../../Context/SidebarContext";
import PaymentMethodModal from "../../components/PaymentMethodModal"; // adjust to where you saved it

const ClientInvoice = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const invoices = useSelector((state) => state.invoices.invoices);
  const dispatch = useDispatch();
  const [invoiceToPay, setInvoiceToPay] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <div className="min-h-screen text-white">
      <div className="flex items-center gap-4 mb-6">
        <span>
          {!sidebarOpen && (
            <MdMenu
              className="text-2xl cursor-pointer text-white/80 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            />
          )}
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-2">
          <FaFileInvoiceDollar className="text-[#a99cf9]" /> Invoices
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invoices.map((inv) => (
          <div key={inv._id} className="glass-card p-4 rounded-xl">
            <p className="text-white/70 text-sm">
              Invoice number: <span className="text-white">{inv.invoiceNumber}</span>
            </p>
            <p className="text-white/70 text-sm">
              Freelancer: <span className="text-white">{inv.createdBy?.name}</span>
            </p>
            <p className="text-white/70 text-sm">
              Amount: <span className="text-white font-semibold">NPR {inv.amount}</span>
            </p>
            <p className="text-white/70 text-sm">
              Due date:{" "}
              <span className="text-white">
                {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}
              </span>
            </p>
            <p className="text-white/70 text-sm">
              Status: <span className="text-white">{inv.status}</span>
            </p>

            {inv.status === "Pending" && (
              <button
                onClick={() => setInvoiceToPay(inv)}
                className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Pay Invoice
              </button>
            )}
          </div>
        ))}
      </div>

      <PaymentMethodModal
        invoice={invoiceToPay}
        onClose={() => setInvoiceToPay(null)}
      />
    </div>
  );
};

export default ClientInvoice;