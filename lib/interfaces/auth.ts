import { User } from './user';

/**
 * Define las credenciales para el inicio de sesión.
 * Corresponde a `CredentialsDTO` del backend.
 */
export interface Credentials {
  Username: string;
  Password: string;
  SelectedTowerId: number;
}

/**
 * Define la respuesta del endpoint de autenticación.
 * Corresponde a `AuthResponseDTO` del backend.
 */
export interface AuthResponse  {
  accessToken: string;
  user: User;
}