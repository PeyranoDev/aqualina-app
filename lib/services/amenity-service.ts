import { Amenity, TimeSlot } from '../interfaces/amenity';

const MOCK_AMENITIES: Amenity[] = [
  {
    id: '1',
    name: 'Salón de Usos Múltiples (SUM)',
    description: 'Espacio para eventos con capacidad para 50 personas.',
    capacity: 50,
  },
  // Aquí se podrían agregar más amenities como "Parrilla", "Gimnasio", etc.
];

const MOCK_TIME_SLOTS: TimeSlot[] = [
  { hour: '09:00', available: true },
  { hour: '10:00', available: true },
  { hour: '11:00', available: false }, 
  { hour: '12:00', available: true },
  { hour: '13:00', available: false },
  { hour: '14:00', available: true },
  { hour: '15:00', available: true },
  { hour: '16:00', available: true },
  { hour: '17:00', available: false },
  { hour: '18:00', available: true },
  { hour: '19:00', available: true },
  { hour: '20:00', available: true },
];


/**
 * Simula la obtención de la lista de amenities.
 */
export const getAmenities = async (): Promise<Amenity[]> => {
  console.log('Fetching amenities...');
  // Simula una demora de red
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Amenities fetched:', MOCK_AMENITIES);
  return MOCK_AMENITIES;
};

/**
 * Simula la obtención de los horarios disponibles para un amenity en una fecha específica.
 * @param amenityId - El ID del amenity.
 * @param date - La fecha seleccionada (string en formato YYYY-MM-DD).
 */
export const getAvailableSlots = async (amenityId: string, date: string): Promise<TimeSlot[]> => {
  console.log(`Fetching slots for amenity ${amenityId} on ${date}`);
  // Simula una demora de red
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // En una implementación real, la lógica de la API devolvería
  // los horarios disponibles para la fecha dada.
  // Aquí simplemente devolvemos los datos mockeados para la demo.
  console.log('Slots fetched:', MOCK_TIME_SLOTS);
  return MOCK_TIME_SLOTS;
};
