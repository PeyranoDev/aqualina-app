import { apiClient } from '../api-client';
import { PagedResponse, PaginationParams } from '../interfaces';
import { User, UserFilterParams, UserForResponse } from '../interfaces/user';

export const userService = {
  async getUser(): Promise<UserForResponse | null> {
    const response = await apiClient.get<UserForResponse>('/user');
    return response.data || null;
  },

  async updateUser(newUser: Partial<User>): Promise<UserForResponse | null> {
    const response = await apiClient.put<UserForResponse>('/user', newUser);
    return response.data || null;
  },

async getUsers(
  filters: UserFilterParams,
  pagination: PaginationParams
): Promise<PagedResponse<UserForResponse> | null> {
  const queryParams = new URLSearchParams({
    ...filters,
    ...pagination,
  } as any);

  const response = await apiClient.get<PagedResponse<UserForResponse>>(
    `/user/all?${queryParams.toString()}`
  );

  return response.data ?? null;
}
};
