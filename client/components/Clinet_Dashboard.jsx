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
import { FaBriefcase, FaUserTie, FaFileInvoiceDollar } from "react-icons/fa6";
import { MdOutlineTaskAlt } from "react-icons/md";
import { fetchConversations } from "../src/features/conversation/convesationSlice";
import SearchBar from "./Searchbar";

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
    dispatch(fetchConversations())
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

    const { unreadCounts } = useSelector((state) => state.conversations)
  const values = Object.values(unreadCounts);
  console.log("this is message values", values);
  // values is an ARRAY of numbers: [3, 0, 2]
  const totalUnread = values.reduce((sum, count) => sum + count, 0);
  console.log("this  is totalunread", totalUnread);
// totalUnread is a single NUMBER: 5
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* ✅ Fixed: sidebar open = no extra margin, closed = pull content left */}
     <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* ✅ Fixed: single header with menu toggle */}
        <div className="flex gap-4 items-center mb-6 flex-wrap">
          <span
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-2xl cursor-pointer transition-all ease-in-out duration-300 text-white/80 hover:text-white ${
              sidebarOpen ? "hidden" :"block"
            }`}
          >
           
          </span>
          <span>
         <img
  src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "C")}&background=7c6cf6&color=fff`}
  alt="Profile"
  className="w-9 h-9 rounded-full object-cover cursor-pointer border border-white/20"
  onClick={() => navigate(`/profilepage/${user._id}`)}
/>
             </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Welcome, <span className="text-gradient">{user?.name || "Client"}</span> 👋
          </h1>
          <div className="ml-auto flex items-center gap-4">
          <span>
            <NotificationBell></NotificationBell>
          </span>

          <span  className="relative inline-block text-xl text-white/80 hover:text-white cursor-pointer transition-colors">
            <FaFacebookMessenger className=""  onClick={() =>
            navigate("/Chatpage")
            } />
              {totalUnread > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-3 h-3 flex items-center justify-center px-1 leading-none">
      {totalUnread > 9 ? "9+" : totalUnread}
    </span>
  )}
          </span>
          <span>
            <SearchBar/>
          </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Total Projects</h3>
              <FaBriefcase className="text-[#7c6cf6] text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-white">{totalProjects}</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Active Freelancers</h3>
              <FaUserTie className="text-[#22d3ee] text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-white">{Totalfreelancer}</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Pending Tasks</h3>
              <MdOutlineTaskAlt className="text-yellow-400 text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-white">{totalTasks}</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Pending Payments</h3>
              <FaFileInvoiceDollar className="text-red-400 text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-red-400">₹{totalPendingAmount}</p>
          </div>

          <div className="col-span-1 glass-card rounded-xl p-4">
            <Piechart totalTasks={totalTasks} />
          </div>

          <div className="col-span-1 glass-card rounded-xl p-4">
            <Paymentpiechart
              totalPaidAmount={totalPaidAmount}
              totalPendingAmount={totalPendingAmount}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-2 glass-card rounded-xl p-4">
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
