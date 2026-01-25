import React, { use } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Privateroute = () => {
  const { user , isLogout} = useSelector((state) => state.auth);
  return (
    user ? <Outlet /> : <Navigate to="/" replace />
    
  
  )
  
};

export default Privateroute;
