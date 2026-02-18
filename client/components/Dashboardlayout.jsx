
import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`
          flex-1 p-6 transition-all duration-300
          ${sidebarOpen ? "md:ml-0" : "md:-ml-60"}
        `}
      >
             <div className="flex-1 p-6">
         {React.isValidElement(children) &&
          React.cloneElement(children, {
            toggleSidebar: () => setSidebarOpen((v) => !v),
            sidebarOpen,
          })}
      </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
