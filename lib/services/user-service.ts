import { apiClient } from '../api-client';

export type UserProfile = {
  name: string;
  surname: string;
  apartment: string;
  email: string;
  role: string;
  phone: string;
};

export type User = {
  name: string;
  surname: string;
  apartment: string;
  email: string;
  phone: string;
};

export const userService = {
  async getUser(): Promise<UserProfile | null> {
    const response = await apiClient.get<UserProfile>('/user');
    return response.data || null;
  },
  
  async updateUser(newUser: Partial<User>): Promise<User | null> {
    const response = await apiClient.put<User>('/user', newUser);
    return response.data || null;
  },
};