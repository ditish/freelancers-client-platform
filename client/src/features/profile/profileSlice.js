// features/profile/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";
import * as svc from "./profileServices";

const profileSlice = createSlice({
  name: "profile",
  initialState: { user: null, stats: null, recentProjects: [], loading: false, error: null },
  reducers: {
    setLoading: (s, a) => { s.loading = a.payload; },
    setProfile: (s, a) => { s.user = a.payload.user; s.stats = a.payload.stats; s.recentProjects = a.payload.recentProjects; s.loading = false; },
    setUser: (s, a) => { s.user = a.payload; },
    setAvatar: (s, a) => { if (s.user) s.user.avatar = a.payload; },
    setError: (s, a) => { s.error = a.payload; s.loading = false; },
  },
});
export const { setLoading, setProfile, setUser, setAvatar, setError } = profileSlice.actions;
export default profileSlice.reducer;

export const fetchProfile = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await svc.fetchProfileAPI(id);
    dispatch(setProfile(res.data));
    return res.data;
  } catch (e) { dispatch(setError(e.response?.data?.message || e.message)); }
};

export const updateProfile = (data) => async (dispatch) => {
  const res = await svc.updateProfileAPI(data);
  dispatch(setUser(res.data));
  return res.data;
};

export const uploadAvatar = (file) => async (dispatch) => {
  const res = await svc.updateAvatarAPI(file);
  dispatch(setAvatar(res.data));
  return res.data;
};