// components/SearchBar.jsx
import React from "react";
import { useState, useRef } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { searchUsersThunk, setSelectedRole, clearSearch } from "../src/features/search/serachSlice";
import { useNavigate } from "react-router-dom";


export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
   const navigate = useNavigate();
  const dispatch = useDispatch();
  const { results, loading, selectedRole } = useSelector((state) => state.search);
  const debounceRef = useRef(null);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    dispatch(clearSearch());
  };

  const handleSelectRole = (role) => {
    dispatch(setSelectedRole(role));
    dispatch(searchUsersThunk("", role)); // fetch default list of 10, no query yet
  };

  const handleBack = () => {
    dispatch(setSelectedRole(null));
    setQuery("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(searchUsersThunk(value, selectedRole)); // empty value still returns default 10
    }, 400);
  };

   const handleUserClick = (user) => {
    const path =
      user.role === "freelancer"
        ? `/client/freelancerProfile/${user._id}`
        : `/clientProfile/${user._id}`; // adjust if your client-profile route differs

    navigate(path);
    handleClose(); // closes dropdown, clears query, clears redux search state
  };
  return (
    <div className="relative flex items-center">
      {!open ? (
        <button onClick={handleOpen} className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
          <FaSearch size={18} />
        </button>
      ) : (
        <div className="flex items-center glass-input rounded-full px-3 py-1.5 w-56 sm:w-72">
          {selectedRole && (
            <button onClick={handleBack} className="mr-1">
              < FaArrowLeft  className="text-white/40" />
            </button>
          )}
          <FaSearch  className="text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={handleChange}
            disabled={!selectedRole}
            placeholder={
              selectedRole
                ? `Search ${selectedRole === "freelancer" ? "freelancers" : "clients"} by name or skill...`
                : "Choose an option below..."
            }
            className="ml-2 outline-none flex-1 bg-transparent text-sm text-white placeholder-white/40 disabled:cursor-not-allowed"
          />
          <button onClick={handleClose}>
            <RxCross1 className="text-white/40 hover:text-white transition-colors" />
          </button>
        </div>
      )}

      {open && (
        <div className="absolute top-11 right-0 sm:left-0 w-72 glass-panel rounded-lg max-h-80 overflow-y-auto z-50 shadow-2xl shadow-black/50">
          {/* Step 2: role picker — shown until a role is chosen */}
          {!selectedRole && (
            <div className="flex flex-col p-2">
              <button
                onClick={() => handleSelectRole("freelancer")}
                className="text-left p-2 rounded hover:bg-white/10 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Freelancers
              </button>
              <button
                onClick={() => handleSelectRole("client")}
                className="text-left p-2 rounded hover:bg-white/10 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Clients
              </button>
            </div>
          )}

          {/* Step 3: list of 10 (default or filtered) */}
          {selectedRole && (
            <>
              {loading && <p className="p-3 text-sm text-white/40">Loading...</p>}
              {!loading && results.length === 0 && (
                <p className="p-3 text-sm text-white/40">No matches found</p>
              )}
              {results.map((user) => (
                <div
               key={user._id}
                      onClick={() => handleUserClick(user)}
                  className="flex items-center gap-2 p-2 hover:bg-white/10 cursor-pointer transition-colors">
                  {/* <img src={user.avatar || "/default-avatar.png"} className="w-8 h-8 rounded-full" /> */}
                  <div>
                    <p className="text-sm font-medium text-white/90">{user.name}</p>
                    <p className="text-xs text-white/40">
                      {user.role === "freelancer" ? user.skills?.join(", ") : "Client"}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
