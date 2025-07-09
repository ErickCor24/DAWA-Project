export interface Reserve {
  id?: number;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  status: boolean;
  clientId: number;       // ← CAMBIO aquí
  vehicleId: number;      // ← CAMBIO aquí
  vehicleName?: string;
}
