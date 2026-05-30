import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../src/features/invoice/invoiceSlice";
import CreateInvoiceModal from "./Createinovices";
import { MdMenu } from "react-icons/md";
import { useSidebar } from "../../Context/SidebarContext";

const Invoices = () => {
    const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [showModel, setShowModal] = useState(false)
  const dispatch = useDispatch();
  const { invoices, isLoading, isError, message } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);
  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading invoices...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">{message}</p>;
const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const formatAmount = (amount) => `$${amount.toFixed(2)}`;

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid": return "bg-green-500";
      case "Pending": return "bg-yellow-500 text-black";
      case "Overdue": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className=" h-screen bg-gray-100">
    


      {
        showModel && (
           <CreateInvoiceModal
       onClose={() => setShowModal(false)}
      ></CreateInvoiceModal>
        )
      }

        <div className="flex justify-between">
        <span>
             {!sidebarOpen && (
        <MdMenu
          className="text-2xl cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      )}
           </span>
 <h2 className="text-3xl font-bold mb-6 text-gray-800">Invoices</h2>
          <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded mb-3"
        >
          + Create Invoice
      </button>
        </div>
       
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-purple-600 text-white">
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
              <tr key={inv._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6">{inv.invoiceNumber }</td>
                <td className="py-3 px-6">{inv.Project?.title || "N/A"}</td>
                <td className="py-3 px-6">{inv.selectedClient?.name|| "N/A"}</td>
                <td className="py-3 px-6 text-right font-medium">{formatAmount(inv.amount)}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-gray-600">{formatDate(inv.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
              </div>
  );
};

export default Invoices;
