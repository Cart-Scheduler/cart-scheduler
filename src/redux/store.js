import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/person';
import userReducer from './slices/user';

const store = configureStore({
  reducer: {
    person: personReducer,
    user: userReducer,
  },
});

export default store;
