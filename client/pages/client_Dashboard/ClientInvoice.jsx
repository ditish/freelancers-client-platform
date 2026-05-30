import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { fetchInvoices } from "../../src/features/invoice/invoiceSlice";

import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";

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
    <div className="p-6">
      <div className="flex items-center gap-60">
      <span>
         {!sidebarOpen && (
              <MdMenu
                className="text-2xl cursor-pointer "
                onClick={() => setSidebarOpen(true)}
              />
            )}
           </span>
        <h2 className="text-2xl font-bold ">Invoices</h2>
        </div>

      {invoices.map((inv) => (
        <div key={inv._id} className="bg-white p-4 shadow rounded mb-3">
          <p>invoicesNumber:{inv.invoiceNumber }</p>
          <p>freelancer:{ inv.createdBy.name}</p>
          <p>Amount: ${inv.amount}</p>
         <p>dueDate:{inv.dueDate }</p>

          {inv.status === "Pending" && (
            <button
              onClick={() => payInvoice(inv._id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Pay Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientInvoice;
