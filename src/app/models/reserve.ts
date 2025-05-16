export interface Reserve {
  id?: string;        // Opcional si es autogenerado
  idClient: number;
  idVehicle: string;
  idAgencyPickup: number;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  status: boolean;
}
