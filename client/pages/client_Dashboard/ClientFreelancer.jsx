
import React, { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";// your axios instance
import { Link } from "react-router-dom";

const ClientFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

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

        <Link
  to={`/client/freelancerProfile/${freelancer._id}`}
  className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded"
>
  View Profile
</Link>

        </div>
      ))}
    </div>
  );
};

export default ClientFreelancers;
