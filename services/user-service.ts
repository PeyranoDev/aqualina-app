import { apiClient } from '../lib/api-client';

export type User = {
  Name: string;
  Surname: string;
  Apartment: string;
  Email: string;
  Phone_Number: string;
};

export const userService = {
  async getUser(): Promise<User | null> {
    const response = await apiClient.get<User>('/user');
    return response.data || null;
  },
  
  async updateUser(newUser: Partial<User>): Promise<User | null> {
    const response = await apiClient.put<User>('/user', newUser);
    return response.data || null;
  },
};