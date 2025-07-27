import { apiClient } from '../api-client';
import { AuthResponse, Credentials } from '../interfaces/auth';

/**
 * Servicio para gestionar las interacciones de autenticación con la API.
 * Su única responsabilidad es comunicarse con el backend.
 */
class AuthService {
  /**
   * Realiza la petición de login al backend.
   * @param credentials Las credenciales del usuario, incluyendo el ID de la torre seleccionada.
   * @returns Una promesa que se resuelve con el objeto AuthResponse.
   */
  async login(credentials: Credentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials, false);
      
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error('La respuesta del servidor no contiene los datos de autenticación.');
      }

    } catch (error) {
      console.error('Error en el servicio de login:', error);
      throw new Error('Error al intentar iniciar sesión. Verifica tus credenciales y la torre seleccionada.');
    }
  }

  /**
   * Realiza la petición de cambio de contraseña al backend.
   * @param password La nueva contraseña.
   */
  async changePassword(password: string): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', { password }, true);
    } catch (error) {
      console.error('Error en el servicio de cambio de contraseña:', error);
      throw new Error('No se pudo cambiar la contraseña.');
    }
  }
}

export const authService = new AuthService();
