import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { createTask, deleteTask, fetchTasks, updateTask } from "../../src/features/task/taskslice"
import {fetchProjects} from "../../src/features/Project/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";

const ClientTasks = () => {
const [showAssignForm, setShowAssignForm] = useState(false);
const [assignTask, setAssignTask] = useState(null); // stores task being reassigned
const [newFreelancerId, setNewFreelancerId] = useState("");

  const [editTask, setEditTask] = useState(null); // stores task being edited
const [showEditForm, setShowEditForm] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showForm, SetshowForm] = useState(false);
  const [createdTask, SetcreatedTask] = useState(null);
   const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
    const [projectId, setProjectId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [Freelancers, setFreelancers] = useState([]);

  const {projects}
    = useSelector((state) => state.projects);
  const {tasks}
    = useSelector((state) => state.tasks);
  console.log("this is my tasks", tasks);
  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/client/freelancers");
      setFreelancers(res.data.freelancers);
    } catch (error) {
      console.log(error);
    } 
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProjects());

   }, [dispatch]);


  useEffect(() => {
    fetchFreelancers();
  }, []);


       useEffect(() => {
     dispatch(fetchTasks());
}, [dispatch]);

  const handleSubmit = (e) => {
    SetshowForm(false);
  e.preventDefault();
  const Selecetdfreelancer = Freelancers.find(
    (f)=>f._id === assignedTo
  )
    const Selecetdproject = projects.find(
    (p)=>p._id === projectId
  )

    // Prepare data object for createTask thunk
    const taskData = {
      title,
      projectId,// the project id this task belongs to
      assignedTo,// selected freelancer id
      deadline,
      status
    };

    // Dispatch the thunk
    console.log("this is task deotails", taskData);

    dispatch(createTask(taskData));

    // Reset form
    setTitle("");
  setAssignedTo("");
  setProjectId("");
  setDeadline("");
  SetcreatedTask({
    title,
    FreelancerName: Selecetdfreelancer?.name,
    projetTitle:Selecetdproject?.title,
})
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("task is updated")
  await dispatch(updateTask({ 
    taskId: editTask._id, 
    taskData: {
      title: editTask.title,
      assignedTo: editTask.assignedTo,
      deadline: editTask.deadline,
      status: editTask.status
    }
  }));
  await dispatch(fetchTasks()); // 👈 re-fetch after update
  setShowEditForm(false);
  setEditTask(null);
  };
  const handleReassign = async () => {
  if (!newFreelancerId) return;
const oldFreelancerId = assignTask.assignedTo?._id;
  await dispatch(updateTask({
    taskId: assignTask._id,
    taskData: {
      assignedTo: newFreelancerId,
      oldFreelancerId,
     } // 👈 only update assignedTo
  }));
    await dispatch(fetchTasks()); // 👈 re-fetch to show updated freelancer
  setShowAssignForm(false);
  setAssignTask(null);
  setNewFreelancerId("");
};

  return (
   <div className="p-6">
  {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span>
           {!sidebarOpen && (
                <MdMenu
                  className="text-2xl cursor-pointer"
                  onClick={() => setSidebarOpen(true)}
                />
              )}
             </span>
    <h2 className="text-2xl font-bold">My Tasks</h2>
    <button
      onClick={() => SetshowForm(true)}
      className="bg-indigo-600 text-white px-4 py-2 rounded"
    >
      + Create Task
    </button>
  </div>

  {/* Task List */}
  {tasks.length === 0 ? (
    <p className="text-gray-500">No task created yet.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-6 shadow rounded relative">
            <button
    className="absolute top-3 right-3 text-gray-500 hover:bg-gray-100 rounded p-1"
    onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
  >
    ⋮
  </button>
          {openMenuId === task._id && (
    <div className="absolute top-10 right-3 bg-white border border-gray-200 rounded shadow-md z-10 w-52">
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                onClick={() => {
                    setAssignTask(task); 
    setNewFreelancerId(task.assignedTo?._id || "")
    setShowAssignForm(true);

                  setOpenMenuId(null);
                }}
      >
        Assign to another freelancer
      </button>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                onClick={() => {
                  setEditTask(task);
                  setShowEditForm(true);
                  setOpenMenuId(null);
                }}
      >
        Edit task
      </button>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-50 text-red-500 text-left"
                onClick={async() => {
                  await dispatch(deleteTask(task._id))
                  await dispatch(fetchTasks());setOpenMenuId(null);
                }}
      >
        Delete task
      </button>
    </div>
  )}
          <h3 className="text-lg font-semibold">{task.title}</h3>

          <p className="text-gray-600">{task.deadline}</p>

          <span className="text-gray-600">Project:</span>
          <p className="text-gray-600">{task.projectId?.title}</p>

          <span className="text-gray-600">Status:</span>
          <p
            className={
              task.status === "Pending"
                ? "text-yellow-400"
                : "text-green-500"
            }
          >
            {task.status}
          </p>

          <p className="mt-2 text-sm">
            Assigned To:{" "}
            <span className="font-semibold">
              {task.assignedTo?.name || "Not assigned"}
            </span>
          </p>
        </div>
      ))}
    </div>
  )}

  {/* ================= MODAL ================= */}
  {showForm && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Create Task</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full border p-3 rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            className="w-full border p-3 rounded"
          >
            <option value="">Select Freelancer</option>
            {Freelancers.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="w-full border p-3 rounded"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => SetshowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
      )}
      
      {showEditForm && editTask && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white w-full max-w-md p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Edit Task</h3>

      <form onSubmit={handleEditSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border p-3 rounded"
          value={editTask.title}
          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
          required
        />

        <select
          className="w-full border p-3 rounded"
          value={editTask.assignedTo?._id || editTask.assignedTo}
          onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
        >
          
          {Freelancers.map((f) => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full border p-3 rounded"
          value={editTask.deadline?.slice(0, 10)} // 👈 format date
          onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
          required
        />

        <select
          className="w-full border p-3 rounded"
          value={editTask.status}
          onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
      )}
     {showAssignForm && assignTask && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white w-full max-w-md p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Reassign Task</h3>
      <p className="text-gray-600 mb-4">
        Task: <span className="font-semibold">{assignTask.title}</span>
      </p>

      <p className="text-gray-600 mb-2">
        Current Freelancer:{" "}
        <span className="font-semibold">
          {assignTask.assignedTo?.name || "Not assigned"}
        </span>
      </p>

            <p>
              select new freelancer
            </p>
      <select
        className="w-full border p-3 rounded mb-4"
        value={newFreelancerId}
        onChange={(e) => setNewFreelancerId(e.target.value)}
      >
    {Freelancers.map((f) => (
          <option key={f._id} value={f._id}>
            {f.name}
          </option>
    ))}
              
      </select>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => {
            setShowAssignForm(false);
            setAssignTask(null);
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={handleReassign}
        >
          Reassign
        </button>
      </div>
    </div>
  </div>
      )}
      

</div>

);

}
      ;

export default ClientTasks;
