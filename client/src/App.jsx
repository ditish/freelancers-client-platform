import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/Forgetpassword";
import VerifyOtp from "../pages/auth/Verifyotp";
import Freelancer_Dashboard from "../components/Freelancer_Dashboard";
import PrivateRoute from "../routes/Privateroutes";
import Projects from "../pages/Freelancer_Dashboard/Project";
import Invoices from "../pages/Freelancer_Dashboard/Invoice";
import Tasks from "../pages/Freelancer_Dashboard/Task.jsx";
import { ToastContainer } from "react-toastify";
import ClientDashboard from "../components/Clinet_Dashboard.jsx";
import ClientProjects from "../pages/client_Dashboard/ClientProject.jsx";
import ClientInvoice from "../pages/client_Dashboard/ClientInvoice.jsx";
import ClientTasks from "../pages/client_Dashboard/ClinetTask.jsx";
import ClientFreelancers from "../pages/client_Dashboard/ClientFreelancer.jsx";
import LoadUser from "../components/LoadUser.jsx";
import {  useSelector } from "react-redux";
import ClientFreelancerProfile from "../pages/client_Dashboard/ClientFreelancerprofile.jsx";
import ProjectDetails from "../pages/Freelancer_Dashboard/Project_details.jsx";
import DashboardLayout from "../components/Dashboardlayout.jsx";

function App() {
  const { isloadingUser } = useSelector((state) => state.auth);
 
       return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <LoadUser />

        {isloadingUser ? (
          <div className="flex items-center justify-center h-screen text-xl">
            Loading...
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<PrivateRoute />}>
              <Route path="/freelance_Dashboard" element={<Freelancer_Dashboard />} />
             <Route path="/Client_Dashboard" element={<ClientDashboard />} />
                     <Route path="/projects/:projectId" element={<ProjectDetails />} />
                     <Route path="/client" element={<DashboardLayout />}>
                         <Route path="projects" element={<ClientProjects />} />
  <Route path="invoices" element={<ClientInvoice />} />
                       <Route path="tasks" element={<ClientTasks />} />
                       <Route path="freelancers" element={<ClientFreelancers />} />
                        <Route path="freelancerProfile/:id" element={<ClientFreelancerProfile />} />
                     </Route>   
              {/* <Route path="/client/projects" element={<ClientProjects />} />
              <Route path="/client/inovices" element={<ClientInvoice />} />
              <Route path="/client/tasks" element={<ClientTasks />} />
               <Route path="/client/freelancers" element={<ClientFreelancers />} />
              <Route path="/client/freelancerProfile/:id"
                       element={<ClientFreelancerProfile />} /> */}
                     <Route path="/freelancer" element={<DashboardLayout />}>
  <Route path="Projects" element={<Projects />} />
  <Route path="Invoices" element={<Invoices />} />
  <Route path="Tasks" element={<Tasks />} />
</Route>

            </Route>
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}
    
      

export default App;
