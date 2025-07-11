// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import employeeReducer from './employeeSlice';
import customerReducer from './customerSlice';
import customerCardReducer from './customerCardSlice';
import authReducer from './loginSlice';
import signupReducer from './signSlice';
import attendanceReducer from './attendanceSlice';
import supplierReducer from './supplierSlice';
import dashboardReducer from './dashboardSlice';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    employees: employeeReducer,
    customers: customerReducer,
    customerCard: customerCardReducer,
    auth: authReducer,
    signup: signupReducer,
    attendances: attendanceReducer,
    suppliers: supplierReducer,
    products: productReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;