import { apiClient } from '../api-client';

// Tipos
export type Vehicle = {
  id: string;
  plate: string;
  model: string;
  color: string;
  is_parked: boolean;
};

export type VehicleRequest = {
  id: string;
  vehicle_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  requested_at: string;
  completed_at?: string;
};

export const vehicleService = {
  async getUserVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>('/vehicles');
    return response.data || [];
  },
  
  // Obtener un vehículo por ID
  async getVehicleById(id: string): Promise<Vehicle | null> {
    const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
    return response.data || null;
  },
  
  // Crear un nuevo vehículo
  async createVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle | null> {
    const response = await apiClient.post<Vehicle>('/vehicles', vehicle);
    return response.data || null;
  },
  
  // Actualizar un vehículo
  async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
    const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, vehicle);
    return response.data || null;
  },
  
  // Eliminar un vehículo
  async deleteVehicle(id: string): Promise<boolean> {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.status === 200;
  },
  
  // Solicitar un vehículo
  async requestVehicle(vehicleId: string): Promise<VehicleRequest | null> {
    const response = await apiClient.post<VehicleRequest>('/vehicle-requests', { vehicle_id: vehicleId });
    return response.data || null;
  },
  
  // Obtener solicitudes de vehículos del usuario
  async getUserVehicleRequests(): Promise<VehicleRequest[]> {
    const response = await apiClient.get<VehicleRequest[]>('/vehicle-requests');
    return response.data || [];
  },
};