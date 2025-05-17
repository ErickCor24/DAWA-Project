export interface Reserve {
  id?: string;      
  idClient: string;
  idVehicle: string;
  idAgencyPickup: number;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  status: boolean;
  vehicleName?: string;
}
