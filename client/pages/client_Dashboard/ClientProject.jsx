import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProjectbyID,
} from "../../src/features/Project/projectSlice";
import API from "../../src/utiles/axiosConfigaxios";
import { useSearchParams } from "react-router-dom";
const ClientProjects = () => {
  const [params] = useSearchParams();
  const freelancerId = params.get("freelancer");
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);

  const [freelancers, setFreelancers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    freelancerId: "",
    deadline: "",
  });


  const HandleonDelete = (projectID) => {
  console.log("this this deleted projectID", projectID)
    dispatch(deleteProjectbyID(projectID));

}

  useEffect(() => {
    if (freelancerId) {
      setForm((prev) => ({ ...prev, freelancerId }));
    }
  }, [freelancerId]);
  /* ================= FETCH DATA ================= */

  useEffect(() => {
    dispatch(fetchProjects());
    fetchFreelancers();
  }, [dispatch]);

  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/client/freelancers");
      setFreelancers(res.data.freelancers);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= CREATE PROJECT ================= */

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProject(form));
    setShowModal(false);
    setForm({
      title: "",
      description: "",
      freelancerId,
      deadline: "",
    });
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Create Project
        </button>
      </div>

      {/* Project List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-6 shadow rounded">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-gray-600">{project.deadline}</p>
              <span className="text-gray-600">Status:</span>
              <p className={project.status == "Pending"?"text-yellow-300":"text-green-400" }> {project.status }</p>

              <p className="mt-2 text-sm">
  Freelancer:{" "}
  <span className="font-semibold">
    {project.freelancer?.length > 0
      ? project.freelancer.map(f => f.name).join(", ")
      : "Not assigned"}
  </span>
</p>
             <button onClick={()=>HandleonDelete(project._id)} className="bg-red-500 px-3 mt-2  py-1  rounded-md ">delete</button>      
            </div>
          ))}
         
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Create Project</h3>

            <form onSubmit={submitHandler} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                className="w-full border p-3 rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Project Description"
                className="w-full border p-3 rounded"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
              <input
                type="date"
                placeholder="deadline"
                className="w-full border p-3 rounded"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
              />


              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
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
};

export default ClientProjects;
