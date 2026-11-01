// pages/PaymentSuccess.jsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { verifyEsewaPayment, resetPayment } from "../../src/features/payment/paymentSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const called = useRef(false);
  const { isVerifying, isSuccess, isError, message } = useSelector((s) => s.payments);

  useEffect(() => {
    if (called.current) return; // StrictMode double-run guard
    called.current = true;
    const data = new URLSearchParams(location.search).get("data");
    if (data) dispatch(verifyEsewaPayment(data));
    return () => dispatch(resetPayment());
  }, []);

  const hasData = new URLSearchParams(location.search).get("data");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {isVerifying && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            <h1 className="text-lg font-semibold text-gray-800">Verifying your payment...</h1>
            <p className="mt-1 text-sm text-gray-500">Please don't close this page.</p>
          </>
        )}

        {isSuccess && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Payment successful</h1>
            <p className="mt-2 text-sm text-gray-500">
              Your invoice has been marked as paid and the freelancer has been notified.
            </p>
            <Link
              to="/client/invoices" // adjust to your route
              className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              Back to invoices
            </Link>
          </>
        )}

        {(isError || (!hasData && !isVerifying && !isSuccess)) && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
              !
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Couldn't confirm payment</h1>
            <p className="mt-2 text-sm text-gray-500">
              {message || "No payment data received."} If money was deducted, it will be
              reconciled shortly. Check your invoices or contact support.
            </p>
            <Link
              to="/client/invoices"
              className="mt-6 inline-block rounded-lg bg-gray-800 px-5 py-2 text-white hover:bg-gray-900"
            >
              Back to invoices
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;