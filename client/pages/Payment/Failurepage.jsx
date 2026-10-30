// pages/PaymentFailed.jsx
import { Link } from "react-router-dom";

const PaymentFailed = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
        ✕
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">Payment failed</h1>
      <p className="mt-2 text-sm text-gray-500">
        The payment was cancelled or didn't go through. Your invoice is still unpaid and you
        haven't been charged.
      </p>
      <Link
        to="/client/invoices"
        className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
      >
        Try again
      </Link>
    </div>
  </div>
);

export default PaymentFailed;