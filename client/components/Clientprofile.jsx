import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../src/utiles/axiosConfigaxios";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";

const FreelancerClientProfile = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get(`/freelancer/clientProfile/${id}`);
      console.log("this is res from client profile", res);
      setClient(res.data.client);
      setStats(res.data.stats);
    };
    fetchProfile();
  }, [id]);

  if (!client) return <p>Loading...</p>;

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
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <p className="text-gray-600">{client.email}</p>

        <p className="mt-4">
          <strong>Company:</strong> {client.company || "Not added"}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat title="Total Projects" value={stats.totalProjects} />
          <Stat title="Completed" value={stats.completed} />
          <Stat title="Pending" value={stats.pending} />
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded text-center">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default FreelancerClientProfile;