import { apiClient } from '../lib/api-client';

export type Reservation = {
  Id: string;
  Amenity: string;
  Reservation_date: string;
  Start_time: string;
  End_time: string;
  Status: 'confirmed' | 'cancelled';
  Created_at: string;
};

export type CreateReservationDto = {
  Amenity: string;
  Reservation_date: string;
  Start_time: string;
  End_time: string;
};

export const reservationService = {
  async getUserReservations(): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>('/reservations');
    return response.data || [];
  },
  
  async getReservationsByDate(date: string): Promise<Reservation[]> {
    const response = await apiClient.get<Reservation[]>(`/reservations/date/${date}`);
    return response.data || [];
  },
  
  async createReservation(reservation: CreateReservationDto): Promise<Reservation | null> {
    const response = await apiClient.post<Reservation>('/reservations', reservation);
    return response.data || null;
  },
  
  async cancelReservation(id: string): Promise<boolean> {
    const response = await apiClient.put<Reservation>(`/reservations/${id}/cancel`, {});
    return response.status === 200;
  },
};