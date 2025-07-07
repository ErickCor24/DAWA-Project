export interface Reserve {
  id?: string;      
  idClient: number; //Ahora es tipo number
  idVehicle: string;
  idAgencyPickup: number;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  status: boolean;
  vehicleName?: string;
}
