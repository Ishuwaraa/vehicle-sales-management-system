export interface Vehicle {
    id: string;
    vehicleType: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
    description: string;
    images: [string],
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AddVehicle {
    vehicleType: string;
    brand: string;
    modelName: string;
    color: string;
    engineSize: string;
    year: number;
    price: number;
    description: string;
}