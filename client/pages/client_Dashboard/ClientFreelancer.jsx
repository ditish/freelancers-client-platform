
import React, { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";// your axios instance
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { useDispatch } from "react-redux";
import { createConversation, setSelectedConversation } from "../../src/features/conversation/convesationSlice";
import { fetchMessages } from "../../src/features/message/messageSlice";

const ClientFreelancers = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

 const handleOnclickmessage = async (receiverId) => {
  try {
    // works because thunk returns the conversation directly
    const conversation = await dispatch(createConversation(receiverId));

    console.log(" this is clientFreelancer conversation", conversation);
//  if (conversation?._id) {
//       await dispatch(setSelectedConversation(conversation));
      navigate("/Chatpage");
    // }
} catch (error) {
    console.error("Failed to create conversation:", error);
  }
};

  if (loading) return <p>Loading freelancers...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <span className="fixed top-10 left-5 p-4"> 
         {!sidebarOpen && (
              <MdMenu
                className="text-2xl cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              />
            )}
      </span>
      <div>
          <h6 className="text-2xl font-bold mb-10 ml-10">freelancer</h6>
          
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
          <button
            onClick={() => {
              handleOnclickmessage(freelancer._id)
            }}
            className="rounded-2xl  bg-blue-400 text-white font-semibold  px-2 py-1 ml-3">
             message 
            </button>
           

        </div>
      ))}
        </div>
        </div>
      
   
  );
};

export default ClientFreelancers;
