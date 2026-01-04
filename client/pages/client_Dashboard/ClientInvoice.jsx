import { useEffect, useState } from "react";
import API from "../../api";

const ClientInvoice = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await API.get("/invoices/getInvoices");
    setInvoices(res.data);
  };

  const payInvoice = async (id) => {
    await API.put(`/invoices/pay/${id}`);
    fetchInvoices();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>

      {invoices.map(inv => (
        <div key={inv._id} className="bg-white p-4 shadow rounded mb-3">
          <p>Amount: ${inv.amount}</p>
          <p>Status: {inv.status}</p>

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
