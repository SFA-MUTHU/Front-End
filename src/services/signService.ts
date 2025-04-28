
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
  };
}

export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(`${API_BASE_URL}/register`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export default { signup };