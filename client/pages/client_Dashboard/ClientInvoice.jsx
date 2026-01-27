import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { fetchInvoices } from "../../src/features/invoice/invoiceSlice";

import { useDispatch, useSelector } from "react-redux";

const ClientInvoice = () => {
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
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>

      {invoices.map((inv) => (
        <div key={inv._id} className="bg-white p-4 shadow rounded mb-3">
          <p>invoicesNumber:{inv.invoiceNumber }</p>
          <p>freelancer:{ inv.createdBy.name}</p>
          <p>Amount: ${inv.amount}</p>
          <p>Status: {inv.status}</p>
          <p>dueDate:{inv.dueDate }</p>

          {inv.status === "unpaid" && (
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
