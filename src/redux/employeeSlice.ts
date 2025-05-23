import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployees, Employee, createEmployee as createEmployeeAPI, deleteEmployee as deleteEmployeeAPI } from '../services/employeeService';

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

// New thunk to create an employee
export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: Partial<Employee>, { rejectWithValue }) => {
    try {
      return await createEmployeeAPI(employeeData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create employee');
    }
  }
);

// Add delete employee thunk
export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteEmployeeAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete employee');
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
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload); // add new employee to the list
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(employee => employee.id !== action.payload); // remove deleted employee from the list
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;