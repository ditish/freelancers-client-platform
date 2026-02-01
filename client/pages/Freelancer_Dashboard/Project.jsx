import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../src/features/Project/projectSlice";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects, isLoading, isError, message } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{message}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4">Project Name</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}className="border-b">
                <td className="py-2 px-4">{p.title}</td>
                <td className="py-2 px-4">{p.client.name}</td>
                <td className={
                  p.status == "Pending"?"text-yellow-500":"text-green-500"
                }>{p.status}</td>
                <td className="py-2 px-4">{new Date(p.deadline).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
