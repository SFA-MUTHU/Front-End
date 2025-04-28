import { API_BASE_URL, getAuthHeaders } from './apiConfig';

export interface TaskCompletion {
  id: number;
  staff_id: number;
  week: string;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
  notes?: string;
  task_level?: number;
  staff?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface TaskCompletionStats {
  total: number;
  completed: number;
  incomplete: number;
  averageCompletion: number;
}

export interface TaskCompletionRate {
  completionRate: number;
  taskCount: number;
}

// Get all task completions with pagination and filtering
export const getAllTaskCompletions = async (
  page: number = 1,
  limit: number = 10,
  filters: { staffId?: number; week?: string } = {}
): Promise<{ 
  data: TaskCompletion[]; 
  pagination: { total: number; page: number; limit: number; pages: number } 
}> => {
  try {
    let url = `${API_BASE_URL}/task-completion?page=${page}&limit=${limit}`;
    
    if (filters.staffId) {
      url += `&staffId=${filters.staffId}`;
    }
    
    if (filters.week) {
      url += `&week=${encodeURIComponent(filters.week)}`;
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
    console.error('Error fetching task completions:', error);
    throw error;
  }
};

// Get task completion by ID
export const getTaskCompletionById = async (id: number): Promise<TaskCompletion> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task-completion/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching task completion with id ${id}:`, error);
    throw error;
  }
};

// Get task completions by staff ID with pagination
export const getTaskCompletionsByStaffId = async (
  staffId: number,
  page: number = 1,
  limit: number = 10
): Promise<{
  data: TaskCompletion[];
  pagination: { total: number; page: number; limit: number; pages: number }
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/task-completion/staff/${staffId}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching task completions for staff ${staffId}:`, error);
    throw error;
  }
};

// Create new task completion
export const createTaskCompletion = async (data: {
  staff_id: number | string;
  week: string;
  completion_percentage: number;
}): Promise<TaskCompletion> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task-completion`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task completion:', error);
    throw error;
  }
};

// Create detailed task completion with additional fields
export const createDetailedTaskCompletion = async (data: {
  staff_id: number | string;
  week?: string;
  completion_percentage: number;
  notes?: string;
  task_level?: number;
  period?: string;
}): Promise<TaskCompletion> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task-completion/detailed`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating detailed task completion:', error);
    throw error;
  }
};

// Update task completion
export const updateTaskCompletion = async (
  id: number,
  data: { staff_id?: number; week?: string; completion_percentage?: number }
): Promise<TaskCompletion> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task-completion/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating task completion with id ${id}:`, error);
    throw error;
  }
};

// Delete task completion
export const deleteTaskCompletion = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task-completion/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting task completion with id ${id}:`, error);
    throw error;
  }
};

// Get weekly task completion data for charts
export const getWeeklyTaskCompletions = async (
  staffId?: string,
  period: string = 'month'
): Promise<Array<{ week: string; completionRate: number; count: number }>> => {
  try {
    let url = `${API_BASE_URL}/task-completion/weekly?period=${period}`;
    
    if (staffId) {
      url += `&staffId=${staffId}`;
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
    console.error('Error fetching weekly task completions:', error);
    throw error;
  }
};

// Get monthly task completion data for charts
export const getMonthlyTaskCompletions = async (
  staffId?: string,
  year?: number
): Promise<Array<{ month: string; completionRate: number; count: number }>> => {
  try {
    let url = `${API_BASE_URL}/task-completion/monthly`;
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
    console.error('Error fetching monthly task completions:', error);
    throw error;
  }
};

// Get task completion statistics
export const getTaskCompletionStats = async (): Promise<TaskCompletionStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/task-completion/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching task completion stats:', error);
    throw error;
  }
};

// Get task completion rate
export const getTaskCompletionRate = async (
  staffId?: string
): Promise<TaskCompletionRate> => {
  try {
    let url = `${API_BASE_URL}/task-completion/rate`;
    
    if (staffId) {
      url += `?staffId=${staffId}`;
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
    console.error('Error fetching task completion rate:', error);
    throw error;
  }
};