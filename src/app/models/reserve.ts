export interface Reserve {
  id?: string;      
  idClient: number;
  idVehicle: string;
  idAgencyPickup: number;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  status: boolean;
  vehicleName?: string;
}
