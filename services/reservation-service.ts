import { apiClient } from '../lib/api-client';

// Tipos
export type Reservation = {
  id: string;
  amenity: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
};

export type CreateReservationDto = {
  amenity: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
};

// Servicio de reservas
export const reservationService = {
  // Obtener todas las reservas del usuario
  async getUserReservations(): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>('/reservations');
    return response.data || [];
  },
  
  // Obtener reservas por fecha
  async getReservationsByDate(date: string): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>(`/reservations/date/${date}`);
    return response.data || [];
  },
  
  // Crear una nueva reserva
  async createReservation(reservation: CreateReservationDto): Promise<Reservation | null> {
    const response = await apiClient.post<Reservation>('/reservations', reservation);
    return response.data || null;
  },
  
  // Cancelar una reserva
  async cancelReservation(id: string): Promise<boolean> {
    const response = await apiClient.put<Reservation>(`/reservations/${id}/cancel`, {});
    return response.status === 200;
  },
};