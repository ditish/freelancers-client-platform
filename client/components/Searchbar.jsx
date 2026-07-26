// components/SearchBar.jsx
import React from "react";
import { useState, useRef } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { searchUsersThunk, setSelectedRole, clearSearch } from "../src/features/search/serachSlice";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  return (
    <div className="relative flex items-center">
      {!open ? (
        <button onClick={handleOpen} className="p-2 rounded-full hover:bg-gray-100">
          <FaSearch size={20} />
        </button>
      ) : (
        <div className="flex items-center border rounded-full px-3 py-1 w-72">
          {selectedRole && (
            <button onClick={handleBack} className="mr-1">
              < FaArrowLeft  className="text-gray-400" />
            </button>
          )}
          <FaSearch  className="text-gray-400" />
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
            className="ml-2 outline-none flex-1 bg-transparent text-sm disabled:cursor-not-allowed"
          />
          <button onClick={handleClose}>
            <RxCross1 className="text-gray-400" />
          </button>
        </div>
      )}

      {open && (
        <div className="absolute top-10 left-0 w-72 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">
          {/* Step 2: role picker — shown until a role is chosen */}
          {!selectedRole && (
            <div className="flex flex-col p-2">
              <button
                onClick={() => handleSelectRole("freelancer")}
                className="text-left p-2 rounded hover:bg-gray-50 text-sm font-medium"
              >
                Freelancers
              </button>
              <button
                onClick={() => handleSelectRole("client")}
                className="text-left p-2 rounded hover:bg-gray-50 text-sm font-medium"
              >
                Clients
              </button>
            </div>
          )}

          {/* Step 3: list of 10 (default or filtered) */}
          {selectedRole && (
            <>
              {loading && <p className="p-3 text-sm text-gray-400">Loading...</p>}
              {!loading && results.length === 0 && (
                <p className="p-3 text-sm text-gray-400">No matches found</p>
              )}
              {results.map((user) => (
                <div key={user._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                  {/* <img src={user.avatar || "/default-avatar.png"} className="w-8 h-8 rounded-full" /> */}
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">
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