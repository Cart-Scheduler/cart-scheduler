import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    initializing: true,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.initializing = false;
      state.user = action.payload;
      delete state.error;
    },
  },
});

export const { setError, setUser } = slice.actions;
export default slice.reducer;
