import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllAttendances,  Attendance } from '../services/employeeService';

interface AttendanceState {
  attendances: Attendance[];
  employeeAttendances: Record<number, Attendance[]>;
  loadingAttendance: boolean;
  errorAttendance: string | null;
}

const initialState: AttendanceState = {
  attendances: [],
  employeeAttendances: {},
  loadingAttendance: false,
  errorAttendance: null,
};

export const getAllAttendances = createAsyncThunk(
  'attendances/getAllAttendances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllAttendances();
      return response; // This will be { data: Attendance[] }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch attendances');
    }
  }
);



const attendanceSlice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAttendances.pending, (state) => {
        state.loadingAttendance = true;
        state.errorAttendance = null;
      })      .addCase(getAllAttendances.fulfilled, (state, action) => {
        state.loadingAttendance = false;
        state.attendances = action.payload.data;
      })
      .addCase(getAllAttendances.rejected, (state, action) => {
        state.loadingAttendance = false;
        state.errorAttendance = action.payload as string;
      })
      
  },
});

export default attendanceSlice.reducer;