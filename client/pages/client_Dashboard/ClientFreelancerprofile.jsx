import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../src/utiles/axiosConfigaxios";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { fetchTasks, assignDirectTasks } from "../../src/features/task/taskslice"; // ✅ fix 3
import { useDispatch, useSelector } from "react-redux"; // ✅ fix 1

const ClientFreelancerProfile = () => {
  const { tasks } = useSelector((state) => state.tasks); // ✅ fix 2
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [stats, setStats] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get(`/client/freelancerProfile/${id}`);
      setFreelancer(res.data.freelancer);
      setStats(res.data.stats);
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (!freelancer) return <p>Loading...</p>;

  const toggleTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((t) => t._id));
    }
  };

  const handleAssign = async () => {
    if (selectedTasks.length === 0) return;
    await dispatch(assignDirectTasks({
      taskIds: selectedTasks,
      assignedTo: freelancer._id,
    }));
    console.log("this is handle assign", selectedTasks,freelancer._id);
    setShowTaskModal(false);
    setSelectedTasks([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <span className="fixed top-2 left-2 p-4">
        {!sidebarOpen && (
          <MdMenu
            className="text-2xl cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </span>

      <div className="bg-white shadow rounded p-6">
        <h1 className="text-3xl font-bold">{freelancer.name}</h1>
        <p className="text-gray-600">{freelancer.email}</p>

        <p className="mt-4">
          <strong>Skills:</strong>{" "}
          {freelancer.skills?.join(", ") || "Not added"}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat title="Total Projects" value={stats.totalProjects} />
          <Stat title="Completed" value={stats.completed} />
          <Stat title="Ongoing" value={stats.ongoing} />
        </div>

        {/* ✅ fix 4 — just open modal */}
        <button
          onClick={() => setShowTaskModal(true)}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded"
        >
          Assign Task
        </button>
      </div>

      {/* ✅ fix 5 — modal is inside return */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Select Tasks to Assign</h3>

            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="selectAll" className="font-semibold cursor-pointer">
                Select All ({tasks.length} tasks)
              </label>
            </div>
            <div className=" max-h-72 overflow-y-auto space-y-2">
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks found</p>
              ) : (
                tasks.map((task) => (
                  <div
                    className="flex items-center gap-2"
                    onClick={() => toggleTask(task._id)}> 
  <input
    type="checkbox"
    checked={selectedTasks.includes(task._id)}
    onChange={() => { toggleTask(task._id)}} 
    onClick={(e) => e.stopPropagation()} //  to stop bubble
    className="w-4 h-4"
  />
  

                    <div>
                      <p className="font-semibold text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Project: {task.projectId?.title || "N/A"} | Status: {task.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <p className="text-sm text-gray-500">
                {selectedTasks.length} task(s) selected
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedTasks([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                  onClick={handleAssign}
                  disabled={selectedTasks.length === 0}
                >
                  Assign {selectedTasks.length > 0 ? `(${selectedTasks.length})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded text-center">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default ClientFreelancerProfile;