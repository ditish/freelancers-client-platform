import searchService from "./serachService";
import { createSlice } from "@reduxjs/toolkit";

// features/search/searchSlice.js
const searchSlice = createSlice({
  name: "search",
  initialState: { results: [], loading: false, error: null, selectedRole: null },
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    clearSearch: (state) => {
      state.results = [];
      state.selectedRole = null;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});


export const { setSelectedRole, clearSearch, setResults, setLoading } = searchSlice.actions;

 export const searchUsersThunk = (query, role) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await searchService.searchUsersService(query, role);
    dispatch(setResults(res.data.results));
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default searchSlice.reducer;