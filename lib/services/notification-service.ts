import { apiClient } from "../api-client";


/**
 * DTO que coincide con el esperado por la Azure Function 'RegisterPushToken'.
 * Asegúrate de que las propiedades coincidan con el `NotificationTokenCreateDTO` de tu backend.
 */
interface RegisterTokenPayload {
  token: string;
  // Añade aquí cualquier otra propiedad que tu DTO espere, por ejemplo:
  // platform: 'ios' | 'android';
}

/**
 * Servicio para gestionar las interacciones con el API de notificaciones.
 */
class NotificationService {
  /**
   * Registra el token de notificación del dispositivo en el backend.
   * @param token El token nativo del dispositivo (FCM/APNS).
   * @returns Una promesa que se resuelve si el registro es exitoso.
   */
  async registerToken(token: string): Promise<void> {
    try {
      console.log(`Enviando token al backend: ${token}`);
      
      const payload: RegisterTokenPayload = {
        token: token,
        // platform: Platform.OS // Podrías enviar la plataforma si tu backend lo necesita
      };
      
      // La ruta debe coincidir exactamente con la de tu Azure Function.
      await apiClient.post('/Notification/RegisterPushToken', payload);
      
      console.log('Token registrado en el backend exitosamente.');
    } catch (error) {
      console.error('Error al registrar el token de notificación en el backend:', error);
      // Opcional: Podrías lanzar el error para manejarlo en el AuthContext.
      // throw error;
    }
  }
}

export default new NotificationService();
