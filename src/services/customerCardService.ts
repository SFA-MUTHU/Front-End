import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface CustomerCardStats {
  totalCustomers: number;
  topCustomerSpend: number;
  totalRevenue: number;
  averageSpend: number;
}

// Fetch customer statistics from separate endpoints
export const getCustomerStats = async (): Promise<CustomerCardStats> => {
  try {
    // Create array of fetch requests
    const responses = await Promise.all([
      fetch(`${API_BASE_URL}/totalcustomers`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE_URL}/top-customer-spend`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE_URL}/total-revenue`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE_URL}/average-spend`, { headers: getAuthHeaders() })
    ]);

    // Check if any responses have errors
    responses.forEach(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    });

    // Parse all JSON responses
    const data = await Promise.all(responses.map(res => res.json()));

    // Combine responses into a single object
    return {
      totalCustomers: data[0].totalCustomers,
      topCustomerSpend: data[1].spend,
      totalRevenue: data[2].totalRevenue,
      averageSpend: data[3].averageSpend
    };
  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    throw error;
  }
};