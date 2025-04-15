import { apiClient } from '../lib/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  token: string;
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    const response = await apiClient.post<{ user: AuthUser }>('/auth/login', credentials, false);
    
    if (response.data?.user) {
      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem('authToken', response.data.user.token);
      return response.data.user;
    }
  
    return null;
  },
  
  // Cerrar sesión
  async logout(): Promise<boolean> {
    try {
      
      // Eliminar el token de AsyncStorage
      await AsyncStorage.removeItem('authToken');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },
  
  // Verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;
      
      // Opcionalmente, verificar si el token es válido
      const response = await apiClient.get('/auth/verify');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  // Obtener el usuario actual
  async getCurrentUser(): Promise<AuthUser | null> {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data || null;
  },
};