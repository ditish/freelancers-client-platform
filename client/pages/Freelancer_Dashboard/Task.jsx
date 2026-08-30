import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask, updateTaskStatus } from "../../src/features/task/taskslice";
import { MdMenu } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { useSidebar } from "../../Context/SidebarContext";


const Tasks = () => {
   const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const { tasks,isError,isLoading,message} = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) return <p className="text-white/50 p-6">Loading...</p>;
  if (isError) return <p className="text-red-400 p-6">{message}</p>;

  const toggleTaskStatus = (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    console.log("this is toggleatask", task._id, task.status
    )
  dispatch(updateTaskStatus({ taskId: task._id, status: newStatus }));
};

  return (
    <div className="min-h-screen text-white">
    
        <div className="flex gap-4 items-center mb-6">
    <span>
             {!sidebarOpen && (
        <MdMenu
          className="text-2xl cursor-pointer text-white/80 hover:text-white"
          onClick={() => setSidebarOpen(true)}
        />
      )}
         </span>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <MdOutlineTaskAlt className="text-[#22d3ee]" /> Tasks
          </h2>
            </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="glass-card rounded-xl p-4 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-white">{task.title}</h3>
              <p className="text-white/50 text-sm">Project: {task.projectId.title}</p>
                <p className="text-white/50 text-sm">assigned by: {task.client.name}</p>
            </div>
            <button
              
              onClick={()=>toggleTaskStatus(task)}
              className={` hover:cursor-pointer px-3 py-1.5 rounded-full self-end text-white text-sm font-medium transition-colors ${
              task.status === "Completed" ? "bg-green-600 hover:bg-green-500" :
              task.status === "Ongoing" ? "bg-yellow-600 hover:bg-yellow-500" :
              "bg-red-600 hover:bg-red-500"
            }`}>
              {task.status}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
