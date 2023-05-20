import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/person';

const store = configureStore({
  reducer: {
    person: personReducer,
  },
});

export default store;
