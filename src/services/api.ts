import { User, LoginCredentials, RegisterData } from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// 通用请求函数
const request = async <T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> => {
  const { params, ...restOptions } = options;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...restOptions.headers,
  };

  // 构建带查询参数的 URL
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// 认证相关 API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('token', response.token);
    return response;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('token', response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    await request('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    return request<User>('/auth/me');
  },
};

// 用户相关 API
export const userApi = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  updatePreferences: async (preferences: User['preferences']): Promise<User> => {
    return request<User>('/users/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  },
};

// 事件相关 API
export const eventApi = {
  getEvents: async (startDate: Date, endDate: Date) => {
    return request('/events', {
      method: 'GET',
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  },

  createEvent: async (event: Omit<Event, 'id'>) => {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  updateEvent: async (id: string, event: Partial<Event>) => {
    return request(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
    });
  },

  deleteEvent: async (id: string) => {
    return request(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// 日记相关 API
export const diaryApi = {
  generateDiary: async (date: Date, events: Event[]) => {
    return request('/diary/generate', {
      method: 'POST',
      body: JSON.stringify({ date, events }),
    });
  },

  saveDiary: async (date: Date, content: string) => {
    return request('/diary', {
      method: 'POST',
      body: JSON.stringify({ date, content }),
    });
  },

  getDiary: async (date: Date) => {
    return request('/diary', {
      method: 'GET',
      params: { date: date.toISOString() },
    });
  },
}; 