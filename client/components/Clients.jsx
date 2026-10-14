import React, { useEffect, useState } from "react";
import API from "../src/utiles/axiosConfigaxios";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";
import { MdMenu } from "react-icons/md";
import { FaBuilding } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  createConversation,
  setSelectedConversation,
} from "../src/features/conversation/convesationSlice";

const Clients = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await API.get("/clients"); // role-neutral endpoint
      setClients(res.data.clients);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOnclickmessage = async (receiverId) => {
    try {
      // manual thunk returns the conversation directly
      const conversation = await dispatch(createConversation(receiverId));
      if (conversation?._id) {
        await dispatch(setSelectedConversation(conversation));
        navigate("/Chatpage");
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  if (loading) return <p className="text-white/50 p-6">Loading clients...</p>;

  // don't show the logged-in user's own card
  const visibleClients = clients.filter((c) => c._id !== user?._id);

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
          <FaBuilding className="text-[#22d3ee]" /> Clients
        </h6>

        {visibleClients.length === 0 ? (
          <p className="text-white/50">No clients found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleClients.map((client) => (
              <div key={client._id} className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white">
                  {client.name}
                </h3>
                <p className="text-white/50">{client.email}</p>

                <Link
                  to={`/profilepage/${client._id}`}
                  className="mt-4 inline-block btn-accent px-4 py-2 rounded-lg text-sm"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => handleOnclickmessage(client._id)}
                  className="rounded-full btn-ghost text-sm px-3 py-2 ml-3"
                >
                  Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;