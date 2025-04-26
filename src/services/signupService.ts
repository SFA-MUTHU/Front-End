import { API_BASE_URL, getAuthHeaders } from './apiConfig';

interface SignupRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: string;
  password: string;
}

export const createAccount = async (userData: SignupRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};