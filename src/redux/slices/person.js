import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDoc, serializableClone } from '../../services/firebase';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const MAX_TRIES = 5;
const POLL_INTERVAL = 1000;

// Returns person id which belongs to authenticated user.
// Person id is saved into user document. Tries to read user document
// multiple times. It might be that cloud function is not yet written it,
// because it triggers automatically from new authenticated user.
export const fetchUser = createAsyncThunk(
  'person/fetchUser',
  async (uid, { getState, requestId }) => {
    const { currentRequestId, loading } = getState().person;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      // allow only one request at a time
      return;
    }

    let userDoc;
    let i = 0;
    while (!userDoc && i < MAX_TRIES) {
      userDoc = await fetchDoc(`users/${uid}`);
      await sleep(POLL_INTERVAL);
      i++;
    }
    if (!userDoc) {
      throw new Error('Reading user doc timed out');
    }
    return serializableClone(userDoc);
  },
);

export const personSlice = createSlice({
  name: 'person',
  initialState: {
    id: null,
    data: null,
    loading: 'idle',
    currentRequestId: undefined,
    error: null,
  },
  reducers: {
    setPerson: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: {
    [fetchUser.pending]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchUser.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.id = action.payload.personId;
        state.currentRequestId = undefined;
      }
    },
    [fetchUser.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export const { setPerson } = personSlice.actions;

export default personSlice.reducer;
