import { apiClient } from '../lib/api-client';

// Tipos
export type News = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
};

// Servicio de noticias
export const newsService = {
  // Obtener todas las noticias
  async getAllNews(): Promise<News[]> {
    const response = await apiClient.get<News[]>('/news');
    return response.data || [];
  },
  
  // Obtener una noticia por ID
  async getNewsById(id: string): Promise<News | null> {
    const response = await apiClient.get<News>(`/news/${id}`);
    return response.data || null;
  },
};