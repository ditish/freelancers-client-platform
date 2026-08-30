import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../../src/features/Project/projectSlice";
import { fetchTaskbyProject } from "../../src/features/task/taskslice";

const ProjectDetails = () => {
  const {projectId} = useParams();
  console.log("this is id", projectId);
  const dispatch = useDispatch();

  const { project } = useSelector((state) => state.projects);
  const { task, isLoading
   } = useSelector((state) => state.tasks);
  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    dispatch(fetchTaskbyProject(projectId));
  }, [dispatch, projectId]);
  console.log("this is task1", task);
  if (isLoading) return <p className="text-white/50 p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      {/* Project Info */}
      <h1 className="text-2xl sm:text-3xl font-display font-bold">{project?.title}</h1>
      <p className="text-white/50 mt-1">{project?.description}</p>

      {/* Tasks */}
      <h2 className="text-xl font-semibold mt-6 mb-4 text-white/90">Tasks</h2>

      {task.length ===0? (
        <p className="text-white/40">No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {task.map((task) => (
            <div
              key={task._id}
              className="p-4 glass-card rounded-xl flex justify-between"
            >
              <div>
                <h3 className="font-medium text-white">{task.title}</h3>
                <p className="text-sm text-white/50">
                  {task.description}
                </p>
              </div>

              <span
                className={`text-sm ${
                  task.status === "done"
                    ? "text-green-400"
                    : task.status === "in-progress"
                    ? "text-blue-400"
                    : "text-yellow-400"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProjectDetails;
