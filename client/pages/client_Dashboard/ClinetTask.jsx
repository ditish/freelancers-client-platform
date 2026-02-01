import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { createTask, fetchTasks } from "../../src/features/task/taskslice"
import {fetchProjects} from "../../src/features/Project/projectSlice";
import { useDispatch, useSelector } from "react-redux";
const ClientTasks = () => {
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

  return (
   <div className="p-6">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
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
        <div key={task._id} className="bg-white p-6 shadow rounded">
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
</div>

);

}
      ;

export default ClientTasks;
