import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from './apiConfig';

// Get main dashboard data with detailed logging
export const fetchDashboardData = async () => {
  try {
    console.log("Fetching from:", `${API_BASE_URL}/dashboard`);
    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    
    console.log("Dashboard API response metrics:", response.data?.data?.metrics || "No metrics data");
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Get sales vs targets data
export const fetchSalesTargets = async (period = 'current_month') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/sales-targets?period=${period}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.data) {
      throw new Error("Invalid data format received from sales targets API");
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching sales targets:', error);
    throw error;
  }
};

// Get analytics data
export const fetchAnalyticsData = async () => {
  try {
    const [totalCustomers, topCustomerSpend, totalRevenue, averageSpend] = await Promise.all([
      axios.get(`${API_BASE_URL}/totalcustomers`, { headers: getAuthHeaders() }),
      axios.get(`${API_BASE_URL}/top-customer-spend`, { headers: getAuthHeaders() }),
      axios.get(`${API_BASE_URL}/total-revenue`, { headers: getAuthHeaders() }),
      axios.get(`${API_BASE_URL}/average-spend`, { headers: getAuthHeaders() })
    ]);

    return {
      totalCustomers: totalCustomers.data.totalCustomers,
      topCustomerSpend: topCustomerSpend.data.spend,
      totalRevenue: totalRevenue.data.totalRevenue,
      averageSpend: averageSpend.data.averageSpend
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Get recent activity logs
export const fetchRecentActivity = async ({ limit = 10, activityType = '' } = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/recent-activity?limit=${limit}${activityType ? `&activityType=${activityType}` : ''}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};
