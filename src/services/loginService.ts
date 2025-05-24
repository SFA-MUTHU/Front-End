import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;

  };
  success: boolean;
  message?: string;
}

// Login function
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Store token in localStorage if received
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};

// Get the current user
export const getCurrentUser = (): unknown => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export default {
  login,
  logout,
  isLoggedIn,
  getCurrentUser
};