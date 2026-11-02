import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdMenu, MdOutlineTaskAlt } from "react-icons/md";
import {
  FaFacebookMessenger,
  FaBriefcase,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa6";
import { fetchTasks } from "../src/features/task/taskslice";
import { fetchInvoices } from "../src/features/invoice/invoiceSlice";
import { fetchProjects } from "../src/features/Project/projectSlice";
import { fetchConversations } from "../src/features/conversation/convesationSlice";
import { Paymentpiechart } from "../src/features/Charts/Paymentspiecharts";
import { Piechart } from "../src/features/Charts/Taskpiecharts";
import Bargraph from "../src/features/Charts/Bargarphs";
import API from "../src/utiles/axiosConfigaxios";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

const Freelancer_Dashboard = () => {
  const [assignedClients, setAssignedClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { totalTasks } = useSelector((state) => state.tasks);
  const { Totalinvoices, totalPendingAmount, totalPaidAmount } = useSelector(
    (state) => state.invoices
  );
  const { totalProjects } = useSelector((state) => state.projects);
  const { unreadCounts } = useSelector((state) => state.conversations);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchMyClients = async () => {
    try {
      const res = await API.get("/my-clients");
      setAssignedClients(res.data.clients.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.allSettled([
      dispatch(fetchTasks()),
      dispatch(fetchInvoices()),
      dispatch(fetchProjects()),
      dispatch(fetchConversations()),
      fetchMyClients(),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  const totalUnread = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Checklist state
  const hasClients = assignedClients > 0;
  const hasProjects = totalProjects > 0;
  const hasTasks = totalTasks > 0;

  // Checklist only for freelancers who have never been assigned a project
  const isFirstTime = !user?.hasBeenAssigned && totalProjects === 0;

  const checklist = [
    { done: hasClients, label: "Find clients to work with", to: "/clients" },
    { done: hasProjects, label: "Get assigned to your first project", to: "/freelancer/Projects" },
    { done: hasTasks, label: "Complete tasks in your project", to: "/freelancer/Tasks" },
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex gap-4 items-center mb-6 flex-wrap">
          {/* Menu button: mobile only */}
          <span
            onClick={() => setSidebarOpen(true)}
            className="text-2xl cursor-pointer text-white/80 hover:text-white md:hidden"
          >
            <MdMenu />
          </span>

          <span>
            <img
              src={
                user?.avatar?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "U"
                )}&background=7c6cf6&color=fff`
              }
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover cursor-pointer border border-white/20"
              onClick={() => navigate(`/profilepage/${user._id}`)}
            />
          </span>

          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Welcome, <span className="text-gradient">{user?.name || "User"}</span>!
          </h1>

          <span className="ml-auto flex items-center gap-4">
            <NotificationBell />

            <span className="relative inline-block text-xl text-white/80 hover:text-white cursor-pointer transition-colors">
              <FaFacebookMessenger onClick={() => navigate("/Chatpage")} />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-3 h-3 flex items-center justify-center px-1 leading-none">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </span>
          </span>
        </div>

        {/* Stats cards + charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Total Projects</h3>
              <FaBriefcase className="text-[#7c6cf6] text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-white">{totalProjects}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">active Client</h3>
              <MdOutlineTaskAlt className="text-[#22d3ee] text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-white">{assignedClients}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Total Invoices</h3>
              <FaFileInvoiceDollar className="text-[#a99cf9] text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-white">{Totalinvoices}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Pending Payments</h3>
              <FaMoneyBillWave className="text-red-400 text-xl" />
            </div>
            <p className="text-3xl font-display font-bold text-red-400">₹{totalPendingAmount}</p>
          </div>

          {loading ? (
            <div className="col-span-full text-white/50 text-sm">Loading...</div>
          ) : isFirstTime ? (
            <div className="col-span-full glass-card rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-display font-bold mb-1">Get started</h2>
              <p className="text-white/60 text-sm mb-6">
                Find clients and get assigned to your first project to see your charts here.
              </p>

              <div className="space-y-3">
                {checklist.map((step) => (
                  <div
                    key={step.label}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3"
                  >
                    <span className={step.done ? "text-white/40 line-through" : "text-white"}>
                      {step.done ? "✓ " : "○ "}
                      {step.label}
                    </span>
                    {!step.done && (
                      <Link
                        to={step.to}
                        className="rounded-lg bg-[#7c6cf6] px-3 py-1.5 text-sm text-white hover:opacity-90"
                      >
                        Start
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
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
                  Totalclient={assignedClients}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Freelancer_Dashboard;