import { useEffect, useState } from "react";
import API from "../../api";

const ClientTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    project: "",
    deadline: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks/client");
    setTasks(res.data.tasks);
  };

  const fetchProjects = async () => {
    const res = await API.get("/projects/client");
    setProjects(res.data.projects);
  };

  const createTask = async (e) => {
    e.preventDefault();
    await API.post("/tasks", form);
    fetchTasks();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Client Tasks</h2>

      <form onSubmit={createTask} className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Task title"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, project: e.target.value })}
        >
          <option>Select Project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Create Task
        </button>
      </form>

      {tasks.map(t => (
        <div key={t._id} className="bg-white p-4 shadow rounded mb-3">
          <h3>{t.title}</h3>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ClientTasks;
