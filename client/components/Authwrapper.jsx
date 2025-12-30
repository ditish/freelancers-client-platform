import React from "react";
const AuthWrapper = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
