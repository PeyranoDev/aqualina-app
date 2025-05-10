import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

export type PushTokenRequest = {
  token: string;
  deviceId?: string;
  platform: 'ios' | 'android';
};

const BACKEND_URI = Constants.expoConfig?.extra?.backendUri;

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const buildOptions = async (
  method: string,
  body?: any,
  authenticated: boolean = true
): Promise<RequestInit> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (authenticated) {
    const token = await getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  return { method, headers, body: body ? JSON.stringify(body) : undefined };
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data?.message || 'Error desconocido',
      status: response.status,
    };
  } catch (error) {
    return {
      error: 'Error parsing response',
      status: response.status,
    };
  }
};

export const apiClient = {
  async get<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponse<T>> {
    try {
      const options = await buildOptions('GET', undefined, authenticated);
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options);
      return handleResponse<T>(response);
    } catch (error) {
      return { error: 'Network error', status: 500 };
    }
  },

  async post<T>(endpoint: string, body: any, authenticated: boolean = true): Promise<ApiResponse<T>> {
    try {
      const options = await buildOptions('POST', body, authenticated);
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options);
      return handleResponse<T>(response);
    } catch (error) {
      return { error: 'Network error', status: 500 };
    }
  },

  async put<T>(endpoint: string, body: any, authenticated: boolean = true): Promise<ApiResponse<T>> {
    try {
      const options = await buildOptions('PUT', body, authenticated);
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options);
      return handleResponse<T>(response);
    } catch (error) {
      return { error: 'Network error', status: 500 };
    }
  },

  async delete<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponse<T>> {
    try {
      const options = await buildOptions('DELETE', undefined, authenticated);
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options);
      return handleResponse<T>(response);
    } catch (error) {
      return { error: 'Network error', status: 500 };
    }
  },
};