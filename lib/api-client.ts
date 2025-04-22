import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Tipo de respuesta genérica
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

// Obtiene el token JWT desde AsyncStorage
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch {
    return null;
  }
};

// Construye las opciones del fetch (headers, método, body, etc.)
const buildOptions = async (
  method: string,
  body?: any,
  authenticated: boolean = true
): Promise<RequestInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authenticated) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data?.message || 'Error desconocido',
    status: response.status,
  };
};

// Cliente de la API con métodos básicos
export const apiClient = {
  async get<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const options = await buildOptions('GET', undefined, authenticated);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body: any, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const options = await buildOptions('POST', body, authenticated);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, body: any, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const options = await buildOptions('PUT', body, authenticated);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const options = await buildOptions('DELETE', undefined, authenticated);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  },
};
