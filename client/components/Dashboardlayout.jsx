
import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
// SidebarContext.js
import { SidebarContext } from "../Context/SidebarContext"


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
   <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

       <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
             <div className="flex-1 p-4 sm:p-6">
       <Outlet></Outlet>
      </div>
      </div>
      </div>
       </SidebarContext.Provider>
    </>

  );
};

export default DashboardLayout;
