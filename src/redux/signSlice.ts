// src/redux/signSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signup, SignupRequest } from '../services/signService';

interface SignupState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SignupState = {
  isLoading: false,
  error: null,
  success: false
};

export const registerUser = createAsyncThunk(
  'signup/register',
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await signup(userData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    resetSignupState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;