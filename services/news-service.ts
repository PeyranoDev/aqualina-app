import { apiClient } from '../lib/api-client';

export type News = {
  Id: string;
  Title: string;
  Content: string;
  Image_url?: string;
  Created_at: string;
};


export const newsService = {
  async getAllNews(): Promise<News[]> {
    const response = await apiClient.get<News[]>('/news');
    return response.data || [];
  },
  
  async getNewsByPage(page: number, pageSize: number): Promise<News[]> {
    const response = await apiClient.get<News[]>(`/news?page=${page}&pageSize=${pageSize}`);
    return response.data || [];
  },
  
  

  async getNewsById(id: string): Promise<News | null> {
    const response = await apiClient.get<News>(`/news/${id}`);
    return response.data || null;
  },
};