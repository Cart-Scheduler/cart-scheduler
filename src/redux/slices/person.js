import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDoc, serializableClone } from '../../services/firebase';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const MAX_TRIES = 5;
const POLL_INTERVAL = 1000;

// Returns person document from Firestore based on given user id.
// Person id is saved into user document. Tries to read user document
// multiple times. It might be that cloud function is not yet written it,
// because it triggers automatically from new authenticated user.
export const fetchPerson = createAsyncThunk(
  'person/fetch',
  async (uid, { getState, requestId }) => {
    const { currentRequestId, loading } = getState().person;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      // allow only one request at a time
      return;
    }

    let userDoc;
    let i = 0;
    while (!userDoc && i < MAX_TRIES) {
      userDoc = await fetchDoc(`users/${uid}`, true);
      await sleep(POLL_INTERVAL);
      i++;
    }
    if (!userDoc) {
      throw new Error('Reading user doc timed out');
    }
    const personDoc = await fetchDoc(`persons/${userDoc.personId}`);
    // we can put only serializable data into state
    return serializableClone(personDoc);
  },
);

export const personSlice = createSlice({
  name: 'person',
  initialState: {
    person: null,
    loading: 'idle',
    currentRequestId: undefined,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchPerson.pending]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchPerson.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.person = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchPerson.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export default personSlice.reducer;
