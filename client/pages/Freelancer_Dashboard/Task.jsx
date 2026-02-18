import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../src/features/task/taskslice";
import { MdMenu } from "react-icons/md";


const Tasks = ({toggleSidebar,sidebarOpen}) => {
  const dispatch = useDispatch();
  const { tasks,isError,isLoading,message} = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{message}</p>;

  return (
    <div className="p-6">
    
        <div className="flex gap-4 items-baseline">
    <span
           onClick={toggleSidebar}
           className={`text-2xl cursor-pointer  ${sidebarOpen ? "hidden" :"" }`}
         >
           <MdMenu />
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
            <span className={`px-3 py-1 rounded-full self-end text-white ${
              task.status === "Completed" ? "bg-green-500" :
              task.status === "Ongoing" ? "bg-yellow-500" :
              "bg-red-500"
            }`}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
