import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as dashboardService from '../services/dashboardService';

// Define types for the dashboard state
interface DashboardState {
  dashboardData: any;
  salesTargets: any;
  customerMetrics: any;
  inventoryStatus: any;
  recentActivity: any;
  analyticsData: {
    totalCustomers: number;
    topCustomerSpend: any;
    totalRevenue: number;
    averageSpend: number;
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  dashboardData: null,
  salesTargets: null,
  customerMetrics: null,
  inventoryStatus: null,
  recentActivity: null,
  analyticsData: {
    totalCustomers: 0,
    topCustomerSpend: null,
    totalRevenue: 0,
    averageSpend: 0
  },
  loading: false,
  error: null
};

// Async thunks with proper error handling for production
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.fetchDashboardData();
      return data;
    } catch (error: any) {
      // For production, we should return structured error info
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch dashboard data',
        details: error.response?.data?.details || error.message
      });
    }
  }
);

export const fetchSalesTargets = createAsyncThunk(
  'dashboard/fetchSalesTargets',
  async (period: string = 'current_month', { rejectWithValue }) => {
    try {
      return await dashboardService.fetchSalesTargets(period);
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch sales targets',
        details: error.response?.data?.details || error.message
      });
    }
  }
);

export const fetchAnalyticsData = createAsyncThunk(
  'dashboard/fetchAnalyticsData',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.fetchAnalyticsData();
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch analytics data',
        details: error.response?.data?.details || error.message
      });
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async ({ limit = 10, activityType = '' }: { limit?: number; activityType?: string } = {}, { rejectWithValue }) => {
    try {
      return await dashboardService.fetchRecentActivity({ limit, activityType });
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch recent activity',
        details: error.response?.data?.details || error.message
      });
    }
  }
);

// Create the dashboard slice with improved error logging
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData(state) {
      state.dashboardData = null;
      state.salesTargets = null;
      state.customerMetrics = null;
      state.inventoryStatus = null;
      state.recentActivity = null;
      state.analyticsData = {
        totalCustomers: 0,
        topCustomerSpend: null,
        totalRevenue: 0,
        averageSpend: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Dashboard data pending");
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.dashboardData = action.payload;
        console.log("Dashboard data fulfilled:", action.payload);
      })
      .addCase(fetchDashboardData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // For production, we should have detailed error info but no dummy data
        state.error = action.payload.message || 'Unknown error';
        console.error("Dashboard data rejected:", action.payload);
      })
      
      // Sales targets
      .addCase(fetchSalesTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesTargets.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.salesTargets = action.payload;
      })
      .addCase(fetchSalesTargets.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message || 'Unknown error';
      })
      
      // Analytics data
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message || 'Unknown error';
      })
      
      // Recent activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message || 'Unknown error';
      });
  }
});

export const { clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
