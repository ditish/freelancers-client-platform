// services/profileService.js
import API from "../../utiles/axiosConfigaxios";
export const fetchProfileAPI = (id) => API.get(id ? `/profile/${id}` : "/profile/me");
export const updateProfileAPI = (data) => API.put("/profile/me", data);
export const updateAvatarAPI = (file) => {
  const fd = new FormData();
  fd.append("avatar", file);
  return API.put("/profile/me/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } });
};