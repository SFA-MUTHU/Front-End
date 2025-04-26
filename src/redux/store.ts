import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import employeeReducer from './employeeSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    employees: employeeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;