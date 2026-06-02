// NotificationBell.jsx
import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import { MdNotifications } from "react-icons/md";
import API from "../src/utiles/axiosConfigaxios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // fetch existing notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await API.get("/notifications/getnotifications");
      setNotifications(res.data);
      console.log("this is notification console", res.data);
    };
    fetchNotifications();
  }, []);

  // listen for real-time notifications
  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications(prev => [notification, ...prev]); // ← prepend new one
    });
    return () => socket.off("newNotification");
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    await API.patch("/notifications/mark-read");
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  const handleOnDelete = async (notificationId) => {
    console.log("this is detelted notificationId ", notificationId);
    await API.delete(`/notifications/delete/${notificationId}`);
    setNotifications(prev => prev.filter( n=> n._id !== notificationId));
  };

  return (
    <div className="relative">
      {/* Bell icon with badge */}
      <div onClick={() => { setShowDropdown(!showDropdown); markAllRead(); }}
        className="cursor-pointer relative">
        <MdNotifications className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white 
            text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            notifications.map(n => (
              <div key={n._id}
                className={`p-3 border-b ${!n.isRead ? "bg-blue-50" : ""}`}>
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                <button onClick={() => { handleOnDelete(n._id)}}>delete</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;