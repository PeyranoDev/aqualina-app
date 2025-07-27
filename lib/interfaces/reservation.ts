
export interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amenityName: string;
}

export interface CreateReservationPayload {
  amenityId: string;
  date: string; 
  hour: string; 
}