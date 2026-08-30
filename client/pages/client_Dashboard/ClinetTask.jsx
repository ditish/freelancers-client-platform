import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { createTask, deleteTask, fetchTasks, updateTask } from "../../src/features/task/taskslice"
import {fetchProjects} from "../../src/features/Project/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";

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
   <div className="min-h-screen text-white">
  {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <span>
           {!sidebarOpen && (
                <MdMenu
                  className="text-2xl cursor-pointer text-white/80 hover:text-white"
                  onClick={() => setSidebarOpen(true)}
                />
              )}
             </span>
    <h2 className="text-2xl font-display font-bold flex items-center gap-2">
      <MdOutlineTaskAlt className="text-[#22d3ee]" /> My Tasks
    </h2>
    <button
      onClick={() => SetshowForm(true)}
      className="btn-accent px-4 py-2 rounded-lg"
    >
      + Create Task
    </button>
  </div>

  {/* Task List */}
  {tasks.length === 0 ? (
    <p className="text-white/40">No task created yet.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tasks.map((task) => (
        <div key={task._id} className="glass-card p-6 rounded-xl relative">
            <button
    className="absolute top-3 right-3 text-white/50 hover:bg-white/10 hover:text-white rounded p-1 transition-colors"
    onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
  >
    ⋮
  </button>
          {openMenuId === task._id && (
    <div className="absolute top-10 right-3 glass-panel rounded-lg shadow-2xl shadow-black/50 z-10 w-52 overflow-hidden">
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-white/10 text-white/80 text-left transition-colors"
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
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-white/10 text-white/80 text-left transition-colors"
                onClick={() => {
                  setEditTask(task);
                  setShowEditForm(true);
                  setOpenMenuId(null);
                }}
      >
        Edit task
      </button>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-500/10 text-red-400 text-left transition-colors"
                onClick={async() => {
                  await dispatch(deleteTask(task._id))
                  await dispatch(fetchTasks());setOpenMenuId(null);
                }}
      >
        Delete task
      </button>
    </div>
  )}
          <h3 className="text-lg font-semibold text-white">{task.title}</h3>

          <p className="text-white/50">{task.deadline}</p>

          <span className="text-white/50">Project:</span>
          <p className="text-white/50">{task.projectId?.title}</p>

          <span className="text-white/50">Status:</span>
          <p
            className={
              task.status === "Pending"
                ? "text-yellow-400"
                : "text-green-400"
            }
          >
            {task.status}
          </p>

          <p className="mt-2 text-sm text-white/70">
            Assigned To:{" "}
            <span className="font-semibold text-white">
              {task.assignedTo?.name || "Not assigned"}
            </span>
          </p>
        </div>
      ))}
    </div>
  )}

  {/* ================= MODAL ================= */}
  {showForm && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel text-white w-full max-w-md p-6 rounded-xl">
        <h3 className="text-xl font-display font-bold mb-4">Create Task</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg glass-input"
          />

          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full p-3 rounded-lg glass-input [&>option]:text-black"
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
            className="w-full p-3 rounded-lg glass-input [&>option]:text-black"
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
            className="w-full p-3 rounded-lg glass-input"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 rounded-lg glass-input [&>option]:text-black"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => SetshowForm(false)}
              className="px-4 py-2 btn-ghost rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 btn-accent rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
      )}
      
      {showEditForm && editTask && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="glass-panel text-white w-full max-w-md p-6 rounded-xl">
      <h3 className="text-xl font-display font-bold mb-4">Edit Task</h3>

      <form onSubmit={handleEditSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 rounded-lg glass-input"
          value={editTask.title}
          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
          required
        />

        <select
          className="w-full p-3 rounded-lg glass-input [&>option]:text-black"
          value={editTask.assignedTo?._id || editTask.assignedTo}
          onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
        >
          
          {Freelancers.map((f) => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-3 rounded-lg glass-input"
          value={editTask.deadline?.slice(0, 10)} // 👈 format date
          onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
          required
        />

        <select
          className="w-full p-3 rounded-lg glass-input [&>option]:text-black"
          value={editTask.status}
          onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 btn-ghost rounded-lg"
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 btn-accent rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
      )}
     {showAssignForm && assignTask && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="glass-panel text-white w-full max-w-md p-6 rounded-xl">
      <h3 className="text-xl font-display font-bold mb-4">Reassign Task</h3>
      <p className="text-white/60 mb-4">
        Task: <span className="font-semibold text-white">{assignTask.title}</span>
      </p>

      <p className="text-white/60 mb-2">
        Current Freelancer:{" "}
        <span className="font-semibold text-white">
          {assignTask.assignedTo?.name || "Not assigned"}
        </span>
      </p>

            <p className="text-white/60 text-sm mb-2">
              select new freelancer
            </p>
      <select
        className="w-full p-3 rounded-lg glass-input mb-4 [&>option]:text-black"
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
          className="px-4 py-2 btn-ghost rounded-lg"
          onClick={() => {
            setShowAssignForm(false);
            setAssignTask(null);
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 btn-accent rounded-lg"
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
