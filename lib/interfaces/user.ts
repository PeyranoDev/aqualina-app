import { Apartment } from './apartment';
import { Tower } from './tower';
import { PaginationParams } from './index';

/**
 * Define los roles de usuario posibles en el sistema.
 * Corresponde al enum `UserRoleEnum` del backend.
 */
export type UserRole = 'user' | 'security' | 'admin';

/**
 * Representa la información completa de un usuario.
 * Corresponde a `UserForResponse` del backend.
 */
export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  role: UserRole;
  phone: string;
  apartmentInfo?: Apartment;
  associatedTowers: Tower[];
}

/**
 * Define los parámetros para filtrar y ordenar los usuarios.
 * Corresponde a `UserFilterParams` del backend.
 */
export interface UserFilterParams {
  name?: string;
  surname?: string;
  username?: string;
  sortBy?: 'name' | 'surname' | 'username';
  isSortAscending?: boolean;
}