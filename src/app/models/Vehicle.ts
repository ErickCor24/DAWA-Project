export interface Vehicle {
    idVehicle?: number;
    idCompany: number;
    idAgency: number;
    brand: string;
    model: string;
    year: number;
    plateNumber: string;
    color: string;
    type: string;
    seats: number;
    transmission: string;
    fuelType: string;
    isAvailable: boolean;
    poster: string;
    status: number;
}