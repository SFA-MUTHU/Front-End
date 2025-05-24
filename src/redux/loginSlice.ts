import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, LoginRequest } from '../services/loginService';

// Create the login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create the logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    logout();
  }
);

// Define the initial state
interface AuthUser {
  id: number;
  name: string;
  email: string;
  // Add other user fields as needed
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  token: localStorage.getItem('token'),
  isLoggedIn: !!localStorage.getItem('token'),
  isLoading: false,
  error: null
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        if (action.payload.user && typeof action.payload.user.id !== 'undefined' && typeof action.payload.user.email === 'string') {
          const userObj = action.payload.user as { id: string; email: string; name?: string };
          state.user = {
            id: Number(userObj.id),
            name: userObj.name || '',
            email: userObj.email
          };
        } else {
          state.user = null;
        }
        state.token = typeof action.payload.token === 'string' ? action.payload.token : null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;