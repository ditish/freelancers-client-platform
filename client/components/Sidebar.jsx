import React, { useEffect } from 'react'
import { MdCancel, MdSpaceDashboard, MdLogout } from "react-icons/md";
import { FaBriefcase, FaFileInvoiceDollar, FaUserTie } from "react-icons/fa6";
import { MdOutlineTaskAlt } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { logOutuser } from "../src/features/auth/authslice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

// ✅ Define nav links per role
const freelancerLinks = [
   { label: "Dashboard",   to: "/freelance_Dashboard", icon: MdSpaceDashboard },
  { label: "Projects", to: "/freelancer/Projects", icon: FaBriefcase },
  { label: "Invoices", to: "/freelancer/Invoices", icon: FaFileInvoiceDollar },
  { label: "Tasks", to: "/freelancer/Tasks", icon: MdOutlineTaskAlt },
  
];

const clientLinks = [
  { label: "Dashboard",   to: "/Client_Dashboard", icon: MdSpaceDashboard },
  { label: "Projects",    to: "/client/projects", icon: FaBriefcase },
  { label: "Invoices",    to: "/client/invoices", icon: FaFileInvoiceDollar },
  { label: "Tasks",       to: "/client/tasks", icon: MdOutlineTaskAlt },
  { label: "Freelancers", to: "/client/freelancers", icon: FaUserTie },
 
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth); // ✅ Get role from Redux

  const handleLogout = () => {
    dispatch(logOutuser());
      toast.success("Logout successful");
    navigate("/");
   
;
  };

  // ✅ Pick links based on role
  const navLinks = role === "client" ? clientLinks : freelancerLinks;
  const dashboardTitle = role === "client" ? "Client Dashboard" : "Freelancer Dashboard";


  return (
    <>
    {/* Mobile backdrop */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}
    <div
      className={`
        bg-black border-r border-white/10 p-6 w-64 space-y-6
        fixed md:relative top-0 left-0 h-full z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-display font-bold text-gradient">
          {dashboardTitle}
        </h2>
        <span
          onClick={() => setSidebarOpen(false)}
          className="text-2xl cursor-pointer text-white/60 hover:text-white transition-colors"
        >
          <MdCancel />
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col space-y-1.5 mt-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
       <Link
  key={link.to}
  to={link.to}
  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
  onClick={() => {
    if (window.innerWidth < 768) {  
      setSidebarOpen(false);
    }
  }}
>
  <Icon className="text-lg shrink-0" />
  <span className="text-sm font-medium">{link.label}</span>
</Link>
          );
        })}

        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-4"
          onClick={handleLogout}
        >
          <MdLogout className="text-lg shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </nav>
    </div>
    </>
  );
};

export default Sidebar;
