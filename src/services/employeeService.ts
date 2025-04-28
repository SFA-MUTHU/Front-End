import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  phone?: string;
  birthday?: string;
  address?: string;
  status?: string;
  nic?: string;
  active?: boolean;
  avatar?: string;
  location?: string;
}

export interface AttendanceRecord {
  id: number;
  staff_id: number;
  date: string;
  check_in: string;
  check_out: string;
  work_hours: string;
  status: string;
  created_at: string;
  updated_at: string;
  staff?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  totalEmployees: number;
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  nic?: string;
  active?: boolean;
  avatar?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  status?: string;
}): Promise<Employee> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    nic?: string;
    active?: boolean;
    avatar?: string;
    phone?: string;
    birthday?: string;
    address?: string;
    status?: string;
  }
): Promise<Employee> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};

// Update employee status (online/offline)
export const updateEmployeeStatus = async (id: number, status: string): Promise<Employee> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating employee status for id ${id}:`, error);
    throw error;
  }
};

// Get employee expenses
export const getEmployeeExpenses = async (id: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/expenses`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching expenses for employee id ${id}:`, error);
    throw error;
  }
};

// Get employee sales
export const getEmployeeSales = async (id: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/sales`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching sales for employee id ${id}:`, error);
    throw error;
  }
};

// Get employee inventory logs
export const getEmployeeInventoryLogs = async (id: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/inventory-logs`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching inventory logs for employee id ${id}:`, error);
    throw error;
  }
};

// Calculate total sales for an employee
export const calculateEmployeeTotalSales = async (id: number): Promise<{ total: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/total-sales`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calculating total sales for employee id ${id}:`, error);
    throw error;
  }
};

// Get employee monthly sales
export const getEmployeeMonthlySales = async (id: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}/monthly-sales`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching monthly sales for employee id ${id}:`, error);
    throw error;
  }
};

// ATTENDANCE MANAGEMENT FUNCTIONS

// Get all attendance records with pagination and filtering
export const getAllAttendanceRecords = async (
  page: number = 1, 
  limit: number = 10, 
  filter: { staffId?: number; status?: string; date?: string } = {}
): Promise<{
  data: AttendanceRecord[];
  pagination: { total: number; page: number; limit: number; pages: number };
}> => {
  try {
    let url = `${API_BASE_URL}/attendance?page=${page}&limit=${limit}`;
    
    if (filter.staffId) {
      url += `&staffId=${filter.staffId}`;
    }
    
    if (filter.status) {
      url += `&status=${encodeURIComponent(filter.status)}`;
    }
    
    if (filter.date) {
      url += `&date=${encodeURIComponent(filter.date)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
};

// Get attendance record by ID
export const getAttendanceById = async (id: number): Promise<AttendanceRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching attendance record with id ${id}:`, error);
    throw error;
  }
};

// Create new attendance record
export const createAttendanceRecord = async (data: {
  staff_id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  work_hours?: string;
  status: string;
}): Promise<AttendanceRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating attendance record:', error);
    throw error;
  }
};

// Update attendance record
export const updateAttendanceRecord = async (
  id: number,
  data: {
    staff_id?: number;
    date?: string;
    check_in?: string;
    check_out?: string;
    work_hours?: string;
    status?: string;
  }
): Promise<AttendanceRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating attendance record with id ${id}:`, error);
    throw error;
  }
};

// Delete attendance record
export const deleteAttendanceRecord = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting attendance record with id ${id}:`, error);
    throw error;
  }
};

// Get employee attendance records
export const getEmployeeAttendance = async (
  id: string, 
  filter?: string
): Promise<AttendanceRecord[]> => {
  try {
    let url = `${API_BASE_URL}/employees/${id}/attendance`;
    
    if (filter && filter !== 'All') {
      url += `?filter=${encodeURIComponent(filter)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching attendance for employee id ${id}:`, error);
    throw error;
  }
};

// Record employee attendance
export const recordEmployeeAttendance = async (data: {
  staff_id: number;
  date: string;
  check_in: string;
  check_out: string;
  work_hours: string;
  status: string;
}): Promise<AttendanceRecord> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error recording employee attendance:', error);
    throw error;
  }
};

// Get attendance statistics
export const getAttendanceStats = async (dateRange?: { 
  from?: string; 
  to?: string 
}): Promise<AttendanceStats> => {
  try {
    let url = `${API_BASE_URL}/attendance/stats`;
    const params = [];
    
    if (dateRange?.from) {
      params.push(`from=${encodeURIComponent(dateRange.from)}`);
    }
    
    if (dateRange?.to) {
      params.push(`to=${encodeURIComponent(dateRange.to)}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    throw error;
  }
};

// Get monthly attendance summary
export const getMonthlyAttendanceSummary = async (
  staffId?: string, 
  year?: number
): Promise<any[]> => {
  try {
    let url = `${API_BASE_URL}/attendance/monthly-summary`;
    const params = [];
    
    if (staffId) {
      params.push(`staffId=${staffId}`);
    }
    
    if (year) {
      params.push(`year=${year}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching monthly attendance summary:', error);
    throw error;
  }
};