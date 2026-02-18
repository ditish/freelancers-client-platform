import React, { useState } from 'react'
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { logOutuser } from "../src/features/auth/authslice";


const Sidebar = ({sidebarOpen,setSidebarOpen}) => {
    const navigate = useNavigate();
    const handleLogout = async() => {
    dispatch(logOutuser());
    navigate("/")
  };
  return (
    <>
      <div
        className={`
    bg-white shadow-lg p-6 w-64 space-y-6
    fixed md:relative top-0 left-0 h-full
    transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    
  `}
      >
        
      
        <div className="flex ">
       
        <h2 className="text-2xl font-bold text-indigo-600">
          Freelancer Dashboard
          </h2>
          <span 
            onClick={() => setSidebarOpen(!sidebarOpen)
              
           }
            className="text-2xl"><MdCancel /></span>
        </div>
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
    </>
  )
}

export default Sidebar