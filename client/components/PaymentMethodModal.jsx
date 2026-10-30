// components/PaymentMethodModal.jsx
import React from "react"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { payWithEsewa, resetPayment } from "../src/features/payment/paymentSlice"; // adjust path

const methods = [
  { id: "esewa", name: "eSewa", color: "bg-green-500", enabled: true },
  { id: "khalti", name: "Khalti", color: "bg-purple-600", enabled: false },
  { id: "fonepay", name: "Fonepay", color: "bg-red-500", enabled: false },
];

const PaymentMethodModal = ({ invoice, onClose }) => {
  const dispatch = useDispatch();
  const { isPaying, isError, message } = useSelector((state) => state.payments);

  // clear stale state each time the modal opens
  useEffect(() => {
    if (invoice) dispatch(resetPayment());
  }, [invoice, dispatch]);

  if (!invoice) return null;

  const handleSelect = (method) => {
    if (!method.enabled || isPaying) return;
    if (method.id === "esewa") dispatch(payWithEsewa(invoice._id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !isPaying && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Choose payment method</h2>
          <button
            onClick={onClose}
            disabled={isPaying}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-500">
          Paying <span className="font-medium text-gray-800">NPR {invoice.amount}</span>
        </p>

        <div className="grid grid-cols-3 gap-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              disabled={!m.enabled || isPaying}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition
                ${m.enabled
                  ? "border-gray-200 hover:border-green-500 hover:shadow-md cursor-pointer"
                  : "cursor-not-allowed border-gray-100 opacity-50"}`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${m.color}`}
              >
                {m.name[0]}
              </span>
              <span className="text-sm font-medium text-gray-800">{m.name}</span>
              {!m.enabled && (
                <span className="absolute -top-2 right-1 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] text-gray-600">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {isPaying && (
          <p className="mt-4 text-center text-sm text-gray-600">Redirecting to eSewa...</p>
        )}
        {isError && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentMethodModal;