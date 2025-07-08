export interface Vehicle {
    id?: number;
    companyId: number;
    brand: string;
    model: string;
    year: number;
    plateNumber: string;
    color: string;
    type: string;
    seats: number;
    transmission: string;
    fueType: string;
    isAvailable: boolean;
    pricePerDay: number;
    poster: string;
    status: boolean;
}