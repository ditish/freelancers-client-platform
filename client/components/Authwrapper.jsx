import React from "react";
import { Link } from "react-router-dom";

const AuthWrapper = ({ title, children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-4 py-10">
      {/* Ambient gradient blobs for the glass effect to pick up */}
      <div className="blob w-72 h-72 md:w-96 md:h-96 bg-[#7c6cf6] -top-20 -left-20 animate-float-slow" />
      <div className="blob w-72 h-72 md:w-96 md:h-96 bg-[#22d3ee] bottom-0 right-0 animate-float-slower" />
      <div className="blob w-56 h-56 bg-[#f6537c] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      {/* Logo / back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white font-display font-bold text-lg z-10"
      >
        <span className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black">
          F
        </span>
        Freelo
      </Link>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-8 animate-fade-in-up">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-6 text-white">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
