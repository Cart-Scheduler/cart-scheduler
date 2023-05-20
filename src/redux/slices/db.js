import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDoc } from '../../services/firebase';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const MAX_TRIES = 30;
const POLL_INTERVAL = 1000;

// Returns person document from Firestore based on given user id.
// Person id is saved into user document. Tries to read user document
// multiple times. It might be that cloud function is not yet written it,
// because it triggers automatically from new authenticated user.
export const fetchPerson = createAsyncThunk('db/fetchPerson', async (uid) => {
  let userDoc;
  let i = 0;
  while (!userDoc && i < MAX_TRIES) {
    userDoc = await fetchDoc(`users/${uid}`, true);
    await sleep(POLL_INTERVAL);
    i++;
  }
  if (!userDoc) {
    return { error: 'timeout' };
  }
  const personDoc = await fetchDoc(`persons/${userDoc.personId}`);
  return personDoc;
});

export const dbSlice = createSlice({
  name: 'db',
  initialState: {},
  reducers: {},
  extraReducers: {
    [fetchPerson.fulfilled]: (state, action) => {
      state.person = action.payload;
    },
  },
});

export default dbSlice.reducer;
