import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { fetchInvoices } from "../../src/features/invoice/invoiceSlice";

import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa6";

const ClientInvoice = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const invoices
= useSelector((state) => state.invoices.invoices);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);


  const payInvoice = async (id) => {
    await API.put(`/invoices/pay/${id}`);
    dispatch(fetchInvoices());
  };

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
          <p className="text-white/70 text-sm">invoicesNumber: <span className="text-white">{inv.invoiceNumber }</span></p>
          <p className="text-white/70 text-sm">freelancer: <span className="text-white">{ inv.createdBy.name}</span></p>
          <p className="text-white/70 text-sm">Amount: <span className="text-white font-semibold">${inv.amount}</span></p>
         <p className="text-white/70 text-sm">dueDate: <span className="text-white">{inv.dueDate }</span></p>

          {inv.status === "Pending" && (
            <button
              onClick={() => payInvoice(inv._id)}
              className="mt-3 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              Pay Now
            </button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default ClientInvoice;
