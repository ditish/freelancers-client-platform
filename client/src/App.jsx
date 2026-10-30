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
;
import LoadUser from "../components/LoadUser.jsx";
import { useSelector } from "react-redux";
import ProjectDetails from "../pages/Freelancer_Dashboard/Project_details.jsx";
import DashboardLayout from "../components/Dashboardlayout.jsx";
import ChatPage from "../components/ChatPage.jsx";
import ReceiveMessageListener from "../components/ReceiveMessageListener.jsx";
import ResetPassword from "../pages/auth/Resetpassword.jsx";
import Clients from "../components/Clients.jsx";
import Freelancers from "../components/Freelancers.jsx";
import Landing from "../pages/landingpage.jsx";
import ProfilePage from "../pages/Profilepage.jsx";
import PaymentSuccess from "../pages/Payment/Sucesspage.jsx";
import PaymentFailed from "../pages/Payment/Failurepage.jsx";

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
              <Route path="/payment/esewa/success" element={<PaymentSuccess />} />
<Route path="/payment/esewa/failure" element={<PaymentFailed />} />
              <Route
                path="/freelance_Dashboard"
                element={<Freelancer_Dashboard />}
              />

              <Route path="/" element={<DashboardLayout />}>
                 <Route
                  path="clients"
                  element={<Clients/>}
                />
                 <Route
                  path="freelancers"
                  element={<Freelancers/>}
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
