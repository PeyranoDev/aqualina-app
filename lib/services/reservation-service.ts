
import { apiClient } from '../api-client';
import { CreateReservationPayload, Reservation } from '../interfaces/reservation';

/**
 * Obtiene las reservas de un usuario.
 * NOTA: Este endpoint necesita ser implementado en el backend.
 */
export const getUserReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await apiClient.get('/reservation/my-reservations');
    return response.data;
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    return [];
  }
};


/**
 * Simula la creación de una nueva reserva.
 * @param payload - Los datos para la nueva reserva.
 */
export const createReservation = async (payload: CreateReservationPayload): Promise<{ success: boolean }> => {
  console.log('Creating reservation with payload:', payload);

  // Simula una llamada a la API
  // En una implementación real, sería algo como:
  // const response = await apiClient.post('/reservation', payload);
  // return response.data;

  // Simula una demora de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simula una respuesta exitosa
  console.log('Reservation created successfully (mocked).');
  return { success: true };
};