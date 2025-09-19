import { AppDataSource } from "../data-source.js";
import Vehicle from "../models/vehicleModel.js";
import { VehicleList } from "../types/vehicle.types.js";

const getVehicleRepository = () => AppDataSource.getRepository(Vehicle);

export const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const vehicleRepository = getVehicleRepository();
    const vehicle = vehicleRepository.create(vehicleData);
    return await vehicleRepository.save(vehicle);
}

export const findAllVehicles = async (sortBy: string = "DESC", pageNo: number = 0, pageSize: number = 10): Promise<VehicleList> => {
    const vehicleRepository = getVehicleRepository();
    const sortOrder = sortBy.toUpperCase() === "ASC" ? "ASC" : "DESC";
    
    const [vehicles, total] = await vehicleRepository.findAndCount({
        order: { createdAt: sortOrder },
        skip: pageNo * pageSize,
        take: pageSize
    });

    const response: VehicleList = {
        vehicles,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNo
    }

    return response;
}

export const findVehicleById = async (id: number): Promise<Vehicle | null> => {
    const vehicleRepository = getVehicleRepository();
    return await vehicleRepository.findOneBy({ id });
}

export const updateVehicleById = async (id: number, vehicleData: Partial<Vehicle>): Promise<Vehicle | null> => {
    const vehicleRepository = getVehicleRepository();

    const vehicle = await vehicleRepository.findOneBy({ id });
    if (!vehicle) return null;

    vehicle.vehicleType = vehicleData.vehicleType!;
    vehicle.brand = vehicleData.brand!;
    vehicle.modelName = vehicleData.modelName!;
    vehicle.color = vehicleData.color!;
    vehicle.engineSize = vehicleData.engineSize!;
    vehicle.year = vehicleData.year!;
    vehicle.price = vehicleData.price!;
    vehicle.description = vehicleData.description!;

    return await vehicleRepository.save(vehicle);   //TODO: 2 select queries
}

export const deleteVehicleById = async (id: number): Promise<{ deleted: boolean; images: string[], message: string }> => {
    const vehicleRepository = getVehicleRepository();

    const vehicle = await vehicleRepository.findOneBy({ id });
    if (!vehicle) {
        return { deleted: false, images: [], message: "Vehicle not found" };
    }

    const imagesToDelete = vehicle.images || [];

    const deleteResult = await vehicleRepository.delete(id);
    if (deleteResult.affected === 0) {
        return { deleted: false, images: [], message: "Error deleting vehicle" };
    }

    return { deleted: true, images: imagesToDelete, message: "Vehicle deleted successfully" };
}