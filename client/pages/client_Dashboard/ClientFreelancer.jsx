
import React, { useEffect, useState } from "react";
import API from "../../src/utiles/axiosConfigaxios";// your axios instance
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { createConversation, setSelectedConversation } from "../../src/features/conversation/convesationSlice";
import { fetchMessages } from "../../src/features/message/messageSlice";

const ClientFreelancers = () => {
    const { user } = useSelector((state) => state.auth);
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

  if (loading) return <p className="text-white/50 p-6">Loading freelancers...</p>;

  return (
    <div className="min-h-screen text-white">
      
      <span className="fixed top-10 left-5 p-4 z-30"> 
         {!sidebarOpen && (
              <MdMenu
                className="text-2xl cursor-pointer text-white/80 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              />
            )}
      </span>
      <div>
          <h6 className="text-2xl font-display font-bold mb-8 flex items-center gap-2">
            <FaUserTie className="text-[#22d3ee]" /> Freelancers
          </h6>
          
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {freelancers.map((freelancer) => (
        <div key={freelancer._id} className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white">{freelancer.name}</h3>
          <p className="text-white/50">{freelancer.email}</p>
          <p className="text-sm mt-2 text-white/70">
            Skills: {freelancer.skills?.join(", ") || "Not added"}
          </p>
       <Link
  to={`/profilepage/${freelancer._id}`}
  className="mt-4 inline-block btn-accent px-4 py-2 rounded-lg text-sm"
>
  View Profile
</Link>
          <button
            onClick={() => {
              handleOnclickmessage(freelancer._id)
            }}
            className="rounded-full btn-ghost text-sm px-3 py-2 ml-3">
             Message 
            </button>
           

        </div>
      ))}
        </div>
        </div>
        </div>
      
   
  );
};

export default ClientFreelancers;
