export interface Vehicle {
    id: number;
    vehicleType: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
    description: string;
    images?: string[],
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VehicleList {
    vehicles: Vehicle[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface AddVehicleRequest {
    vehicleType: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
    description: string;
    images: string[],
}

export interface UpdateVehicleRequest {
    vehicleType: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
    description: string;
}