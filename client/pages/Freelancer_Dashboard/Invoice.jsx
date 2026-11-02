import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../src/features/invoice/invoiceSlice";
import CreateInvoiceModal from "./Createinovices";

import { FaFileInvoiceDollar } from "react-icons/fa6";


const Invoices = () => {
   
  const [showModel, setShowModal] = useState(false)
  const dispatch = useDispatch();
  const { invoices, isLoading, isError, message } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);
  if (isLoading) return <p className="text-center mt-10 text-white/40">Loading invoices...</p>;
  if (isError) return <p className="text-center mt-10 text-red-400">{message}</p>;
const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const formatAmount = (amount) => `$${amount.toFixed(2)}`;

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Overdue": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-white/10 text-white/70 border border-white/20";
    }
  };

  return (
    <div className="min-h-screen text-white">
    


      {
        showModel && (
           <CreateInvoiceModal
       onClose={() => setShowModal(false)}
      ></CreateInvoiceModal>
        )
      }

        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
       
 <h2 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-2"><FaFileInvoiceDollar className="text-[#a99cf9]" /> Invoices</h2>
          <button
          onClick={() => setShowModal(true)}
          className="btn-accent px-4 py-2 rounded-lg"
        >
          + Create Invoice
      </button>
        </div>
       
      <div className="overflow-x-auto glass-card rounded-xl">
        <table className="min-w-full">
          <thead className="bg-white/5 text-white/70 text-sm uppercase tracking-wide">
            <tr>
              <th className="py-3 px-6 text-left"
              >
                invoice No
              </th>
              <th className="py-3 px-6 text-left">Invoice #</th>
              <th className="py-3 px-6 text-left">Client</th>
              <th className="py-3 px-6 text-right">Amount</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-6 text-white/80">{inv.invoiceNumber }</td>
                <td className="py-3 px-6 text-white/80">{inv.Project?.title || "N/A"}</td>
                <td className="py-3 px-6 text-white/80">{inv.selectedClient?.name|| "N/A"}</td>
                <td className="py-3 px-6 text-right font-medium text-white">{formatAmount(inv.amount)}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-white/50">{formatDate(inv.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
              </div>
  );
};

export default Invoices;
