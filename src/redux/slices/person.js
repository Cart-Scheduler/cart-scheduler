import { createSlice } from '@reduxjs/toolkit';

export const personSlice = createSlice({
  name: 'person',
  initialState: {},
  reducers: {
    setPerson: (state, action) => {
      return action.payload;
    },
  },
});

export const { setPerson } = personSlice.actions;

export default personSlice.reducer;
