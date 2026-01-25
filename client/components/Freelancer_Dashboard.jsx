import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {  logOutuser } from "../src/features/auth/authslice";
const Freelancer_Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async() => {
    dispatch(logOutuser());
    navigate("/")
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg p-6 w-64 space-y-6 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-2xl font-bold text-indigo-600">
          Freelancer Dashboard
        </h2>
        <nav className="flex flex-col space-y-3 mt-6">
          <Link className="hover:text-indigo-600" to="/Projects">
            Project
          </Link>

          <Link className="hover:text-indigo-600" to="/Invoice">
            Invoices
          </Link>

          <Link className="hover:text-indigo-600" to="/Task">
            Task
          </Link>

          <button className="hover:text-red-600 mt-6" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "User"}!
          </h1>
          <button
            className="md:hidden bg-gray-200 p-2 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Toggle Sidebar
          </button>
        </div>

        {/* Freelancer_Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Projects
            </h3>
            <p className="text-2xl font-bold text-indigo-600">12</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
            <p className="text-2xl font-bold text-green-600">24</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Invoices
            </h3>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </div>
        </div>

        {/* Charts can go here later */}
      </div>
    </div>
  );
};

export default Freelancer_Dashboard;
