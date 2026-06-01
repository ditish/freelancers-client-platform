import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask, updateTaskStatus } from "../../src/features/task/taskslice";
import { MdMenu } from "react-icons/md";
import { useSidebar } from "../../Context/SidebarContext";


const Tasks = () => {
   const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const { tasks,isError,isLoading,message} = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{message}</p>;

  const toggleTaskStatus = (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    console.log("this is toggleatask", task._id, task.status
    )
  dispatch(updateTaskStatus({ taskId: task._id, status: newStatus }));
};

  return (
    <div className="p-6">
    
        <div className="flex gap-4 items-baseline">
    <span>
             {!sidebarOpen && (
        <MdMenu
          className="text-2xl cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      )}
         </span>
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-600">Project: {task.projectId.title}</p>
                <p className="text-gray-600">assigned by: {task.client.name}</p>
            </div>
            <button
              
              onClick={()=>toggleTaskStatus(task)}
              className={` hover:cursor-pointerpx-3 py-1 px-2 rounded-full self-end text-white ${
              task.status === "Completed" ? "bg-green-500" :
              task.status === "Ongoing" ? "bg-yellow-500" :
              "bg-red-500"
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
