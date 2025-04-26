
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployees, Employee } from '../services/employeeService';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const getEmployees = createAsyncThunk(
  'employees/getEmployees',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEmployees();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch employees');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;