import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../src/features/Project/projectSlice";
import { useNavigate } from "react-router-dom";

import { FaBriefcase } from "react-icons/fa6";



const Projects = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, isLoading, isError, message } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (isLoading) return <p className="text-white/50 p-6">Loading...</p>;
  if (isError) return <p className="text-red-400 p-6">{message}</p>;

  return (
    <div className="min-h-screen text-white">
  
  
        <div className="flex gap-4 items-center mb-6">
       
      <h2 className="text-2xl font-display font-bold flex items-center gap-2">
        <FaBriefcase className="text-[#7c6cf6]" /> Projects
      </h2>
        </div>
       
      <div className="overflow-x-auto glass-card rounded-xl">
        <table className="min-w-full">
          <thead className="bg-white/5 text-white/70 text-sm uppercase tracking-wide">
            <tr>
              <th className="py-3 px-4 text-left">Project Name</th>
              <th className="py-3 px-4 text-left">Client</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)} className="border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                <td className="py-3 px-4 font-medium text-white/90">{p.title}</td>
                <td className="py-3 px-4 text-white/70">{p.client.name}</td>
                <td className={
                  "py-3 px-4 " + (p.status == "Pending"?"text-yellow-400":"text-green-400")
                }>{p.status}</td>
                <td className="py-3 px-4 text-white/60">{new Date(p.deadline).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      </div>
  );
};

export default Projects;
