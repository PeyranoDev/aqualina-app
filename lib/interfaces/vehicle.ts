import { PaginationParams } from './index';

/**
 * Representa un vehículo registrado por un usuario.
 * Corresponde a `VehicleForResponseDTO` del backend.
 */
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
}

/**
 * Define los parámetros para filtrar y ordenar los vehículos.
 * Corresponde a `VehicleFilterParams` del backend.
 */
export interface VehicleFilterParams extends PaginationParams {
  licensePlate?: string;
  sortBy?: 'brand' | 'model' | 'licensePlate';
  isSortAscending?: boolean;
}