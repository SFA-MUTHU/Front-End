
import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface UserProfile {
  profileImage?: string;
  name: string;
  mobileNumber: string;
  dob: string;
  nic: string;
  role: string;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};