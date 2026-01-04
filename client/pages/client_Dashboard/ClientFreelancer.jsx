import React, { useEffect, useState } from "react";
import API from "../../api"; // your axios instance

const ClientFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/users/freelancers");
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

  if (loading) return <p>Loading freelancers...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {freelancers.map((freelancer) => (
        <div key={freelancer._id} className="bg-white p-6 shadow rounded">
          <h3 className="text-xl font-bold">{freelancer.name}</h3>
          <p className="text-gray-600">{freelancer.email}</p>
          <p className="text-sm mt-2">
            Skills: {freelancer.skills?.join(", ") || "Not added"}
          </p>

          <button
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => alert(`Assign project to ${freelancer.name}`)}
          >
            Assign Project
          </button>
        </div>
      ))}
    </div>
  );
};

export default ClientFreelancers;
