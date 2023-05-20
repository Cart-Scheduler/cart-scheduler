import { configureStore } from '@reduxjs/toolkit';
import dbReducer from './slices/db';

const store = configureStore({
  reducer: {
    db: dbReducer,
  },
});

export default store;
