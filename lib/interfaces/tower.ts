import { PaginationParams } from './index';

/**
 * Representa una torre del complejo.
 * Corresponde a `TowerForUserResponseDTO` del backend.
 */
export interface Tower {
  id: number;
  name: string;
  description?: string;
}

/**
 * Define los parámetros para filtrar y ordenar las torres.
 * Corresponde a `TowerFilterParams` del backend.
 */
export interface TowerFilterParams extends PaginationParams {
  name?: string;
  sortBy?: 'name' | 'id';
  isSortAscending?: boolean;
}
