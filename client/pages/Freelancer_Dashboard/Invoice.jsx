import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../src/features/invoice/invoiceSlice"

const Invoices = () => {
  const dispatch = useDispatch();
  const { invoices, isLoading, isError, message } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{message}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="py-2 px-4">Invoice #</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b">
                <td className="py-2 px-4">{inv.project.tittle}</td>
                <td className="py-2 px-4">{inv.client.name}</td>
                <td className="py-2 px-4">${inv.amount}</td>
                <td className="py-2 px-4">
                  <span className={`px-3 py-1 rounded-full text-white ${
                    inv.status === "Paid" ? "bg-green-500" :
                    inv.status === "Pending" ? "bg-yellow-500" :
                    "bg-red-500"
                    }`}>{inv.status}</span>
                  <span className="px-3 py-1 rounded-2xl text-white">{inv.dueDate }</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
