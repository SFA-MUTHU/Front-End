// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';
import customerCardReducer from './customerCardSlice';

import employeeReducer from './employeeSlice';
import supplierReducer from './supplierSlice';
import productReducer from './productSlice';

import authReducer from './loginSlice';
import signupReducer from './signSlice';


export const store = configureStore({
  reducer: {
    customers: customerReducer,
    customerCard: customerCardReducer,

    employees: employeeReducer,
    suppliers: supplierReducer,
    products: productReducer,

    auth: authReducer,
    signup: signupReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;