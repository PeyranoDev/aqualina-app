import { Tower } from './tower';

/**
 * Representa la información de un apartamento.
 * Corresponde a `ApartmentInfoDTO` del backend.
 */
export interface Apartment {
  id: number;
  identifier: string;
  tower?: Tower;
}