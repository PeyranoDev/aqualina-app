import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api-client';
import { PagedResponse, PaginationParams } from '../interfaces';
import { User, UserFilterParams } from '../interfaces/user';

export const userService = {
  async getUser(): Promise<User | null> {
    const response = await apiClient.get<User>('/user');
    return response.data || null;
  },

  async updateUser(newUser: Partial<User>): Promise<User | null> {
    const response = await apiClient.put<User>('/user', newUser);
    return response.data || null;
  },

async getUsers(
  filters: UserFilterParams,
  pagination: PaginationParams
): Promise<PagedResponse<User> | null> {
  const queryParams = new URLSearchParams({
    ...filters,
    ...pagination,
  } as any);

  const response = await apiClient.get<PagedResponse<User>>(
    `/user/all?${queryParams.toString()}`
  );

  return response.data ?? null;
}
};
