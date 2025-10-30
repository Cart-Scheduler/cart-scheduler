// Slice for Firebase Cloud Messaging related data

import { createSlice } from '@reduxjs/toolkit';
import { reset } from '../actions';

const initialState = {};

export const slice = createSlice({
  name: 'fcm',
  initialState,
  reducers: {
    setDocId: (state, action) => {
      state.docId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reset, () => initialState);
  },
});

export const { setDocId, setToken } = slice.actions;
export default slice.reducer;
