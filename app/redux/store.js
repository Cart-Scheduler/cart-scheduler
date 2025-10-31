import pkg from '@reduxjs/toolkit';
const { configureStore } = pkg;

import authReducer from './slices/auth';
import dbReducer from './slices/db';
import fcmReducer from './slices/fcm';

const store = configureStore({
  reducer: {
    auth: authReducer,
    db: dbReducer,
    fcm: fcmReducer,
  },
});

export default store;
