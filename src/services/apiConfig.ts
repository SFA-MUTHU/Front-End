// Base URL for API requests
export const API_BASE_URL =  'http://localhost:3000/api';

// Get authentication headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Handle API response errors
export const handleApiError = (error: any) => {
  // Check if the error is from fetch API
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject('No response received from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    return Promise.reject(error.message || 'An unexpected error occurred');
  }
};