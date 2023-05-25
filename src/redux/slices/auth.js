import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    initializing: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.initializing = false;
      state.user = action.payload;
    },
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
