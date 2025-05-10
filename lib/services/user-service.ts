import { apiClient } from '../api-client';

export type UserProfile = {
  Name: string;
  Surname: string;
  Apartment: string;
  Email: string;
  Role: string;
  Phone: string;
};

export type User = {
  Name: string;
  Surname: string;
  Apartment: string;
  Email: string;
  Phone: string;
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