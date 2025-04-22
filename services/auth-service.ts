import { apiClient } from '../lib/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LoginCredentials = {
  Username: string;
  Password: string;
};


export const authService = {
  async login(credentials: LoginCredentials): Promise<boolean> {
    const response = await apiClient.post<{ token: string }>('/auth/login', credentials, false);
    
    if (response.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      return true;
    }
  
    return false;
  },
  
  async logout(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem('authToken');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },
  
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return false;
      return true
    } catch (error) {
      return false;
    }
  },
};