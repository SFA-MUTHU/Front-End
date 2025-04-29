import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCustomer, Customer } from '../services/customerService';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData: Customer, { rejectWithValue }) => {
    try {
      return await createCustomer(customerData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create customer');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;