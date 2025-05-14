import { apiClient } from '../api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from './notification-service';

export type LoginCredentials = {
  Username: string;
  Password: string;
};


export const authService = {
  
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await apiClient.post<{ accessToken: string }>('/auth/login', credentials, false);
      
      if (response.status.toString() == "200") {
        await AsyncStorage.setItem('authToken', response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
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

  async changePassword(password: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/change-password', { password }, true);
      if (response.status !== 200) return false;
      return true;
    } catch (error) {
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