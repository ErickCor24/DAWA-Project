export interface Vehicle {
    id?: string;
    idCompany: string;
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
    pricePerDay: number;
    poster: string;
    status: number;
}