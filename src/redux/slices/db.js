import { createSlice } from '@reduxjs/toolkit';
import { reset } from '../actions';

const initialState = {
  // Loading flags.
  // Use double underscores in the start and end to because it cannot be
  // a collection ID.
  __loading__: {},
};

export const slice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.__loading__[action.payload] = true;
    },
    setDoc: (state, action) => {
      const { path, data, key } = action.payload;
      state[path] = data;
      delete state.__loading__[key];
    },
    setChangedDocs: (state, action) => {
      const { removed, changed, key } = action.payload;
      for (const path of removed) {
        delete state[path];
      }
      for (const path in changed) {
        state[path] = changed[path];
      }
      delete state.__loading__[key];
    },
    removeDoc: (state, action) => {
      delete state[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reset, () => initialState);
  },
});

export const { setDoc, setChangedDocs, startLoading, removeDoc } =
  slice.actions;
export default slice.reducer;
