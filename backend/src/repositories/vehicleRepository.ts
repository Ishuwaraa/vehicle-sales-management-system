import { AppDataSource } from "../data-source.js";
import Vehicle from "../models/vehicleModel.js";
import { searchRequest } from "../types/search.types.js";
import { VehicleList } from "../types/vehicle.types.js";
import { Like, Between } from 'typeorm';

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

export const findVehicleBySearchParam = async (searchRequest: searchRequest): Promise<VehicleList> => {
    const pageSize = 1;
    const pageNo = searchRequest.page ? searchRequest.page : 0;
    const vehicleRepository = getVehicleRepository();

    const searchField = searchRequest.searchField.toLowerCase();
    let whereClause: any = {};
    let minPrice: number = 0;
    let maxPrice: number = 5000000;

    switch (searchField) {
        case 'brand':
            whereClause = { brand: Like(`%${searchRequest.searchTerm}%`) };
            break;
        case 'modelname':
            whereClause = { modelName: Like(`%${searchRequest.searchTerm}%`) };
            break;
        case 'year':
            const year = parseInt(searchRequest.searchTerm);
            if (isNaN(year)) {
                throw new Error('Invalid year value');
            }
            whereClause = { year: year };
            break;
        case 'vehicletype':
            whereClause = { vehicleType: Like(`%${searchRequest.searchTerm}%`) };
            break;
        case 'color':
            whereClause = { color: searchRequest.searchTerm };
            break;
        case 'enginesize':
            whereClause = { engineSize: searchRequest.searchTerm };
            break;
        case 'price':
            switch (searchRequest.searchTerm) {
                case 'Mid-Range':
                    minPrice = 5000001;
                    maxPrice = 15000000;
                    break;
                case 'Luxury':
                    minPrice = 15000001;
                    maxPrice = 400000000000;
                    break;
            }

            whereClause = { price: Between(minPrice, maxPrice) };
    }

    const [vehicles, total] = await vehicleRepository.findAndCount({ 
        where: whereClause,
        order: { createdAt: "DESC" },
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