import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Forgetpassword from "../pages/auth/Forgetpassword";
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
import { useSelector } from "react-redux";
import ClientFreelancerProfile from "../pages/client_Dashboard/ClientFreelancerprofile.jsx";
import ProjectDetails from "../pages/Freelancer_Dashboard/Project_details.jsx";
import DashboardLayout from "../components/Dashboardlayout.jsx";
import ChatPage from "../components/ChatPage.jsx";
import ReceiveMessageListener from "../components/ReceiveMessageListener.jsx";
import ResetPassword from "../pages/auth/Resetpassword.jsx";
import ClientProfile from "../components/Clientprofile.jsx";
import Landing from "../pages/landingpage.jsx";
import ProfilePage from "../pages/Profilepage.jsx";

function App() {
  const { isloadingUser } = useSelector((state) => state.auth);
return (
    <>
    <ToastContainer position="top-right" autoClose={1000}
    />
      <BrowserRouter>
        <LoadUser />
 <ReceiveMessageListener />
        {isloadingUser ? (
          <div className="flex items-center justify-center h-screen text-xl">
            Loading...
          </div>
        ) : (
          <Routes>
              <Route path="/" element={<Landing/>} />
               <Route path="/Chatpage" element={<ChatPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgetpassword />} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            
            <Route element={<PrivateRoute />}>
              
              <Route
                path="/freelance_Dashboard"
                element={<Freelancer_Dashboard />}
              />

              <Route path="/" element={<DashboardLayout />}>
                 <Route
                  path="clientProfile/:id"
                  element={<ClientProfile />}
                />
              </Route>
              <Route path="/" element={<DashboardLayout />}>
                 <Route
                  path="profilepage/:id"
                  element={<ProfilePage />}
                />
              </Route>
              
              <Route path="/Client_Dashboard" element={<ClientDashboard />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/client" element={<DashboardLayout />}>
                <Route path="projects" element={<ClientProjects />} />
                <Route path="invoices" element={<ClientInvoice />} />
                <Route path="tasks" element={<ClientTasks />} />
                <Route path="freelancers" element={<ClientFreelancers />} />
                <Route
                  path="freelancerProfile/:id"
                  element={<ClientFreelancerProfile />}
                />
                 
              </Route>

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
