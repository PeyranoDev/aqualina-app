/**
 * Define los estados posibles de una reserva.
 * Corresponde al enum `ReservationStatusEnum` del backend.
 */
export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled';

/**
 * Representa una reserva de amenity.
 * Corresponde a la entidad `Reservation` del backend.
 */
export interface Reservation {
  id: number;
  amenityId: number;
  userId: number;
  startTime: string; 
  endTime: string;   
  status: ReservationStatus;
}

/**
 * Define la estructura para crear una nueva reserva.
 * Corresponde a `CreateReservationDTO` del backend.
 */
export interface CreateReservationPayload {
  amenityId: number;
  startTime: string; 
  endTime: string;   
}
