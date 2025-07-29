import { apiClient } from "../api-client";
import { Tower } from "../interfaces/tower";


const TOWER_API_URL = '/towers';

export const getTowers = async (): Promise<Tower[]> => {
  try {

    const response = await apiClient.get<Tower[]>(TOWER_API_URL+"/public-list");
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching towers:', error);
    throw error;
  }
};
