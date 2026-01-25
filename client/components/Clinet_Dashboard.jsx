import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetLogin } from "../src/features/auth/authslice";
const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
   dispatch(resetLogin())
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg p-6 w-64 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-2xl font-bold text-indigo-600">Client Dashboard</h2>

        <nav className="flex flex-col space-y-4 mt-6">
          <Link to="/client/projects" className="hover:text-indigo-600">My Projects</Link>
          <Link to="/client/freelancers" className="hover:text-indigo-600">Freelancers</Link>
          <Link to="/client/tasks" className="hover:text-indigo-600">Tasks</Link>
          <Link to="/client/inovices" className="hover:text-indigo-600">Invoices</Link>

          <button onClick={handleLogout} className="text-red-600 mt-6">
            Logout
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "Client"} 👋
          </h1>

          <button
            className="md:hidden bg-gray-200 p-2 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Toggle Sidebar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow rounded">
            <h3>Total Projects</h3>
            <p className="text-2xl font-bold text-indigo-600">6</p>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3>Active Freelancers</h3>
            <p className="text-2xl font-bold text-green-600">4</p>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3>Pending Tasks</h3>
            <p className="text-2xl font-bold text-yellow-600">9</p>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3>Pending Payments</h3>
            <p className="text-2xl font-bold text-red-600">₹12,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
