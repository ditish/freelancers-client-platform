import React from "react";
import { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";
import { createTask } from "../../src/features/task/taskslice"
const ClientTasks = () => {
  const [showForm, SetshowForm] = useState(false);
  const [createdTask,SetcreatedTask] = useState(null)
   const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
const [Freelancers, setFreelancers] = useState([]);
    const fetchFreelancers = async () => {
    try {
      const res = await API.get("/client/freelancers");
      setFreelancers(res.data.freelancers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();

   }, []);

const handleSubmit = (e) => {
  e.preventDefault();
  const Selecetdfreelancer = Freelancers.Find(
    (f)=>f._id === assignedTo
  )

    // Prepare data object for createTask thunk
    const taskData = {
      title,
      project: projectId, // the project id this task belongs to
      assignedTo,         // selected freelancer id
      deadline,
      status
    };

    // Dispatch the thunk
    dispatch(createTask(taskData));

    // Reset form
    setTitle("");
    setAssignedTo("");
  setDeadline("");
  SetcreatedTask({
    title,
    FreelancerName: Selecetdfreelancer?.name
})
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

      {/* NO TASK CREATED */}
      {!createdTask && !showForm && (
        <div className="text-center space-y-4">
          <p className="text-gray-600">No task created yet</p>
          <button
            onClick={() => SetshowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      )}

      {/* TASK FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-semibold text-center">Create Task</h2>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
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
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Task
          </button>
        </form>
      )}

      {/* TASK RESULT */}
      {createdTask && (
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-green-600">
            Task Created 🎉
          </h2>
          <p>
            <span className="font-medium">Title:</span> {createdTask.title}
          </p>
          <p>
            <span className="font-medium">Freelancer:</span>{" "}
            {createdTask.freelancerName}
          </p>

          <button
            onClick={() => {
            SetcreatedTask(null);
             SetshowForm(true);
            }}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Another Task
          </button>
        </div>
      )}
    </div>
  </div>
);

};

export default ClientTasks;
