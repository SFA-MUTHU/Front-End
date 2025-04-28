// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import employeeReducer from './employeeSlice';
import customerReducer from './customerSlice';
import customerCardReducer from './customerCardSlice';
import authReducer from './loginSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    employees: employeeReducer,
    customers: customerReducer,
    customerCard: customerCardReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;