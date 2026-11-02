import React from "react";
import { MdCancel, MdMenu, MdSpaceDashboard, MdLogout } from "react-icons/md";
import { FaBriefcase, FaBuilding, FaFileInvoiceDollar, FaUserTie } from "react-icons/fa6";
import { MdOutlineTaskAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { logOutuser } from "../src/features/auth/authslice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Define nav links per role
const sharedLinks = [
  { label: "Freelancers", to: "/freelancers", icon: FaUserTie },
  { label: "Clients", to: "/clients", icon: FaBuilding },
];

const freelancerLinks = [
  { label: "Dashboard", to: "/freelance_Dashboard", icon: MdSpaceDashboard },
  { label: "Projects", to: "/freelancer/Projects", icon: FaBriefcase },
  { label: "Invoices", to: "/freelancer/Invoices", icon: FaFileInvoiceDollar },
  { label: "Tasks", to: "/freelancer/Tasks", icon: MdOutlineTaskAlt },
];

const clientLinks = [
  { label: "Dashboard", to: "/Client_Dashboard", icon: MdSpaceDashboard },
  { label: "Projects", to: "/client/projects", icon: FaBriefcase },
  { label: "Invoices", to: "/client/invoices", icon: FaFileInvoiceDollar },
  { label: "Tasks", to: "/client/tasks", icon: MdOutlineTaskAlt },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logOutuser());
    toast.success("Logout successful");
    navigate("/");
  };

  const roleLinks = role === "client" ? clientLinks : freelancerLinks;
  const navLinks = [...roleLinks, ...sharedLinks];
  const dashboardTitle =
    role === "client" ? "Client Dashboard" : "Freelancer Dashboard";

  // Shared classes for every row (links + logout)
  const rowBase =
    "flex items-center gap-3 py-2.5 rounded-lg transition-colors whitespace-nowrap";
  const rowLayout = sidebarOpen ? "px-3" : "px-3 md:px-0 md:justify-center";
  const labelClass = sidebarOpen ? "" : "md:hidden";

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          bg-black border-r border-white/10 space-y-6 overflow-hidden shrink-0
          fixed md:relative top-0 left-0 h-full z-50
          transition-all duration-300 ease-in-out
          ${
            sidebarOpen
              ? "w-64 p-6 translate-x-0"
              : "w-64 p-6 -translate-x-full md:translate-x-0 md:w-16 md:px-2 md:py-6"
          }
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center ${
            sidebarOpen ? "justify-between" : "md:justify-center"
          }`}
        >
          <h2
            className={`text-lg font-display font-bold text-gradient whitespace-nowrap ${
              sidebarOpen ? "" : "md:hidden"
            }`}
          >
            {dashboardTitle}
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl cursor-pointer text-white/60 hover:text-white transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <MdCancel /> : <MdMenu />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-1.5 mt-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                title={link.label}
                className={`${rowBase} ${rowLayout} text-white/70 hover:text-white hover:bg-white/5`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Icon className="text-lg shrink-0" />
                <span className={`text-sm font-medium ${labelClass}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}

          <button
            title="Logout"
            className={`${rowBase} ${rowLayout} text-left text-white/50 hover:text-red-400 hover:bg-red-500/10 mt-4`}
            onClick={handleLogout}
          >
            <MdLogout className="text-lg shrink-0" />
            <span className={`text-sm font-medium ${labelClass}`}>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;