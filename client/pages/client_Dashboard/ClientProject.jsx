import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProjectbyID,
} from "../../src/features/Project/projectSlice";
import API from "../../src/utiles/axiosConfigaxios";
import { useSearchParams } from "react-router-dom";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa6";
import { createTask } from "../../src/features/task/taskslice";


const ClientProjects = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [showForm, SetshowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
      const [projectId, setProjectId] = useState("");
    const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [params] = useSearchParams();
  const freelancerId = params.get("freelancer");

  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);

  const [freelancers, setFreelancers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/client/freelancers");
      setFreelancers(res.data.freelancers);
    } catch (error) {
      console.error(error);
    }
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    freelancerId: "",
    deadline: "",
  });


  const HandleonDelete =  async(projectID) => {
  console.log("this this handler projectID", projectID)
     await dispatch(deleteProjectbyID(projectID));
    await  dispatch(fetchProjects());

  }
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      SetshowForm(false);
   
    const Selecetdfreelancer = freelancers.find(
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
  
      await dispatch(createTask(taskData));
      await dispatch(fetchProjects());//refetching data after cretaion of data 
  
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
    <div className="min-h-screen text-white">
      
      {/* Header */}
      <div className="flex justify-between flex-wrap gap-3  items-center mb-6">
        <span>
           {!sidebarOpen && (
                <MdMenu
                  className="text-2xl cursor-pointer text-white/80 hover:text-white"
                  onClick={() => setSidebarOpen(true)}
                />
              )}
             </span>
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <FaBriefcase className="text-[#7c6cf6]" /> My Projects
        </h2>
        <button
          className="btn-accent px-4 py-2 rounded-lg"
          onClick={() => setShowModal(true)}
        >
          + Create Project
        </button>
      </div>

      {/* Project List */}
      {isLoading ? (
        <p className="text-white/50">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-white/40">No projects created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <p className="text-white/50">{project.description}</p>
              <p className="text-white/50">{project.deadline}</p>
               <p className="text-white/50"> totalTask:{project.totalTask}</p>
              <span className="text-white/50">Status:</span>
              <p className={project.status == "Pending"?"text-yellow-400":"text-green-400" }> {project.status }</p>

              <p className="mt-2 text-sm text-white/70">
  Freelancer:{" "}
                <span className="font-semibold text-white">
                    {project.taskFreelancers?.length > 0
      ? project.taskFreelancers.join(", ") 
      : "Not assigned"}
  </span>
              </p>
              <div className="flex gap-2">
              <button onClick={() => HandleonDelete(project._id)} className="bg-red-600/80 hover:bg-red-600 text-white px-3 mt-2  py-1.5  rounded-lg text-sm transition-colors ">delete</button>   
                <button onClick={() => {
                  SetshowForm(true)
                  setProjectId(project._id)
                }
                } className="btn-ghost px-3 mt-2  py-1.5  rounded-lg text-sm ">create task</button> 
                </div>
            </div>
          ))}
         
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel text-white w-full max-w-md p-6 rounded-xl">
            <h3 className="text-xl font-display font-bold mb-4">Create Project</h3>

            <form onSubmit={submitHandler} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                className="w-full p-3 rounded-lg glass-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Project Description"
                className="w-full p-3 rounded-lg glass-input"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
              <input
                type="date"
                placeholder="deadline"
                className="w-full p-3 rounded-lg glass-input"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
              />


              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 btn-ghost rounded-lg"
                  onClick={() => setShowModal(false)}
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
                disabled
            className="w-full p-3 rounded-lg glass-input opacity-60 [&>option]:text-black"
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
            {freelancers.map((f) => (
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

    </div>
  );
};

export default ClientProjects;
