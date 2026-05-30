import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { fetchTasks } from "../src/features/task/taskslice"
import {fetchInvoices} from "../src/features/invoice/invoiceSlice"
import {  fetchProjects  } from "../src/features/Project/projectSlice";
import { Paymentpiechart } from "../src/features/Charts/Paymentspiecharts";
import { Piechart } from "../src/features/Charts/Taskpiecharts";
import Bargraph from "../src/features/Charts/Bargarphs";
import API from "../src/utiles/axiosConfigaxios";
import { MdMenu } from "react-icons/md";
import Sidebar from "./Sidebar";
const Freelancer_Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
      <Sidebar sidebarOpen={sidebarOpen}
      setSidebarOpen ={setSidebarOpen}
      ></Sidebar>
 <div  className={`
    flex-1 p-6
    transition-all duration-300 ease-in-out
    ${sidebarOpen ? "md:ml-0" : "md:-ml-60"}
  `}>
        <div className="flex gap-4 items-center mb-6">
          <span
          onClick={()=>setSidebarOpen(!sidebarOpen)}
            className={`text-2xl transition-all ease-in-out duration-300
              ${sidebarOpen ? "hidden" : ""}`}><MdMenu /></span>
          <h1 className="text-3xl font-bold">
              
            Welcome, {user?.name || "User"}!
          </h1>
       
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
