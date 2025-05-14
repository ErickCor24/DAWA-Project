export interface Reserve {
  id: number;        // Opcional si es autogenerado
  idClient: number;
  idVehicle: number;
  idAgencyPickup: number;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  status: boolean;
}
