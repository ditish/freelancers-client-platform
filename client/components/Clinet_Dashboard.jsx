import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetLogin } from "../src/features/auth/authslice";
import { fetchTasks } from "../src/features/task/taskslice";
import { fetchInvoices } from "../src/features/invoice/invoiceSlice";
import { fetchProjects } from "../src/features/Project/projectSlice";
import API from "../src/utiles/axiosConfigaxios";
import { Piechart } from "../src/features/Charts/Taskpiecharts";
import Bargraph from "../src/features/Charts/Bargarphs";
import { Paymentpiechart } from "../src/features/Charts/Paymentspiecharts";
import Sidebar from "./Sidebar";
import { MdMenu } from "react-icons/md"; // ✅ Added missing import
import NotificationBell from "./NotificationBell";
import { FaFacebookMessenger } from "react-icons/fa6";
import ChatPage from "./ChatPage";

const ClientDashboard = () => {
  const [Totalfreelancer, setTotalfreelancer] = useState(0);
  const [Totalclient, setTotalClient] = useState(0);
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { totalTasks } = useSelector((state) => state.tasks);
  const { totalProjects } = useSelector((state) => state.projects);
  const { totalPendingAmount, totalPaidAmount } = useSelector(
    (state) => state.invoices
  );

  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/client/freelancers");
      setTotalfreelancer(res.data.freelancers.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllClient = async () => {
    try {
      const res = await API.get("/auth/getAllclient");
      setTotalClient(res.data.totalClient || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFreelancers();
    fetchAllClient();
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchInvoices());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(resetLogin());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ✅ Fixed: sidebar open = no extra margin, closed = pull content left */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-0" : "md:ml-0"
        }`}
      >
        {/* ✅ Fixed: single header with menu toggle */}
        <div className="flex gap-4 items-center mb-6">
          <span
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-2xl cursor-pointer transition-all ease-in-out duration-300 ${
              sidebarOpen ? "hidden" : "block"
            }`}
          >
            <MdMenu />
          </span>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "Client"} 👋
          </h1>
          <span>
            <NotificationBell></NotificationBell>
          </span>
          <span>
            <FaFacebookMessenger onClick={() =>
              navigate("/Chatpage")
            } />
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow rounded">
            <h3>Total Projects</h3>
            <p className="text-2xl font-bold text-indigo-600">{totalProjects}</p>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3>Active Freelancers</h3>
            <p className="text-2xl font-bold text-green-600">{Totalfreelancer}</p>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3>Pending Tasks</h3>
            <p className="text-2xl font-bold text-yellow-600">{totalTasks}</p>
          </div>

          <div className="bg-white p-6 shadow rounded">
            <h3>Pending Payments</h3>
            <p className="text-2xl font-bold text-red-600">₹{totalPendingAmount}</p>
          </div>

          <div className="col-span-1">
            <Piechart totalTasks={totalTasks} />
          </div>

          <div className="col-span-1">
            <Paymentpiechart
              totalPaidAmount={totalPaidAmount}
              totalPendingAmount={totalPendingAmount}
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Bargraph
              totalTasks={totalTasks}
              totalProjects={totalProjects}
              Totalfreelancer={Totalfreelancer}
              Totalclient={Totalclient}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;