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
  const { task, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    dispatch(fetchTaskbyProject(projectId));
  }, [dispatch, projectId]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {/* Project Info */}
      <h1 className="text-2xl font-bold">{project?.title}</h1>
      <p className="text-gray-600">{project?.description}</p>

      {/* Tasks */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Tasks</h2>

      {task.length ===0? (
        <p>No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {task.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white shadow rounded flex justify-between"
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500">
                  {task.description}
                </p>
              </div>

              <span
                className={`text-sm ${
                  task.status === "done"
                    ? "text-green-600"
                    : task.status === "in-progress"
                    ? "text-blue-600"
                    : "text-yellow-600"
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
