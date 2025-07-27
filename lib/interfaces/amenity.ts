export interface Amenity {
  id: string;
  name: string;
  description: string;
  capacity: number;
}

export interface TimeSlot {
  hour: string;
  available: boolean;
}