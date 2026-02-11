import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logOutuser } from "../src/features/auth/authslice";
import { fetchTasks } from "../src/features/task/taskslice"
import {fetchInvoices} from "../src/features/invoice/invoiceSlice"
import {  fetchProjects  } from "../src/features/Project/projectSlice";
import { Paymentpiechart } from "../pages/client_Dashboard/Paymentpiechart";
import { Piechart } from "../pages/client_Dashboard/Piechart";
import Bargraph from "../pages/client_Dashboard/Bargraph";
import API from "../src/utiles/axiosConfigaxios";
const Freelancer_Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { totalTasks } = useSelector((state) => state.tasks);
  const { Totalinvoices } = useSelector((state) => state.invoices);
  const { totalPendingAmount } = useSelector((state) => state.invoices);
    const { totalPaidAmount  } = useSelector((state) => state.invoices);
  const { totalProjects } = useSelector((state) => 
    state.projects
  )

  const [Totalclient, setTotalClient] = useState(0)
   const [Totalfreelancer,setTotalfreelancer] =useState(0)

  const handleLogout = async() => {
    dispatch(logOutuser());
    navigate("/")
  };

const fetchAllClient = async () => {
    try {
      const res = await API.get("/auth/getAllclient");
      setTotalClient(res.data.totalClient || 0);
      console.log("this is clinet data", res.data)
    } catch (error) {
      console.log(error);
    } 
  }
 const fetchFreelancers = async () => {
    try {
      const res = await API.get("/client/freelancers");
      setTotalfreelancer(res.data.freelancers.length || 0);
   
    } catch (error) {
      console.log(error);
    } 
  };

    useEffect(() => {
      fetchAllClient();
      fetchFreelancers();
    }, []);

   useEffect(() => {
     dispatch(fetchTasks());
     dispatch(fetchInvoices());
     dispatch(fetchProjects());
}, [dispatch]);

  
  console.log(" toataltask", totalTasks);
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
          <Link className="hover:text-indigo-600" to="/freelancer/Projects">
            Project
          </Link>

          <Link className="hover:text-indigo-600" to="/freelancer/Invoices">
            Invoices
          </Link>

          <Link className="hover:text-indigo-600" to="/freelancer/Tasks">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Projects
            </h3>
            <p className="text-2xl font-bold text-indigo-600">{ totalProjects }</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
            <p className="text-2xl font-bold text-green-600">{ totalTasks }</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Invoices
            </h3>
            <p className="text-2xl font-bold text-purple-600">{Totalinvoices }</p>
          </div>

                <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Pending payemnts
            </h3>
            <p className="text-2xl font-bold text-red-400"> RS{totalPendingAmount }</p>
          </div>
           
               <div className="col-span-1 ">
              <Piechart totalTasks={totalTasks} />
            </div>

           <div className="col-span-1 ">
                        <Paymentpiechart
                          totalPaidAmount={totalPaidAmount}
                          totalPendingAmount ={totalPendingAmount}
                        ></Paymentpiechart>
          </div> 
             <div className="col-span-1 md:col-span-2">
    <Bargraph
      totalTasks={totalTasks}
              totalProjects={totalProjects}
              Totalclient={Totalclient}
              Totalfreelancer={Totalfreelancer}
              
    />
            </div>
          
        </div>

      </div>
    </div>
  );
};

export default Freelancer_Dashboard;
