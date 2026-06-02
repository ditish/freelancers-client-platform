import React, { useEffect } from 'react'
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { logOutuser } from "../src/features/auth/authslice";
import { useDispatch, useSelector } from 'react-redux';

// ✅ Define nav links per role
const freelancerLinks = [
   { label: "Dashboard",   to: "/freelance_Dashboard"},
  { label: "Projects", to: "/freelancer/Projects" },
  { label: "Invoices", to: "/freelancer/Invoices" },
  { label: "Tasks", to: "/freelancer/Tasks" },
   {label:"notification" ,to :"NotificationBell"},
];

const clientLinks = [
  { label: "Dashboard",   to: "/Client_Dashboard" },
  { label: "Projects",    to: "/client/projects" },
  { label: "Invoices",    to: "/client/invoices" },
  { label: "Tasks",       to: "/client/tasks" },
  { label: "Freelancers", to: "/client/freelancers" },
  {label:"notification" ,to :"NotificationBell"},
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth); // ✅ Get role from Redux

  const handleLogout = () => {
    dispatch(logOutuser());
    navigate("/");
  };

  // ✅ Pick links based on role
  const navLinks = role === "client" ? clientLinks : freelancerLinks;
  const dashboardTitle = role === "client" ? "Client Dashboard" : "Freelancer Dashboard";


  return (
    <div
      className={`
        bg-white shadow-lg p-6 w-64 space-y-6
        fixed md:relative top-0 left-0 h-full z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-600">
          {dashboardTitle}
        </h2>
        <span
          onClick={() => setSidebarOpen(false)}
          className="text-2xl cursor-pointer hover:text-red-500 transition-colors"
        >
          <MdCancel />
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col space-y-3 mt-6">
        {navLinks.map((link) => (
       <Link
  key={link.to}
  to={link.to}
  className="hover:text-indigo-600 transition-colors"
  onClick={() => {
    if (window.innerWidth < 768) {  
      setSidebarOpen(false);
    }
  }}
>
  {link.label}
</Link>
        ))}

        <button
          className="text-left hover:text-red-600 mt-6 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;