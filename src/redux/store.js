import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import dbReducer from './slices/db';

const store = configureStore({
  reducer: {
    auth: authReducer,
    db: dbReducer,
  },
});

export default store;
