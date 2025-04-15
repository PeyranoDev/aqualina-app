import { apiClient } from '../lib/api-client';

// Tipos
export type Profile = {
  id: string;
  full_name: string;
  apartment: string;
  email: string;
};

// Servicio de perfil
export const profileService = {
  // Obtener el perfil del usuario
  async getUserProfile(): Promise<Profile | null> {
    const response = await apiClient.get<Profile>('/profile');
    return response.data || null;
  },
  
  // Actualizar el perfil del usuario
  async updateProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const response = await apiClient.put<Profile>('/profile', profile);
    return response.data || null;
  },
};