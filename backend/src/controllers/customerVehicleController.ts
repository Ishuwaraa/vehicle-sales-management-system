import { Request, Response } from 'express';
import { findAllVehicles, findVehicleById, findVehicleBySearchParam } from '../repositories/vehicleRepository.js';
import { getArrayOfImageUrls } from '../middlewares/awsMiddleware.js';
import { searchRequest } from '../types/search.types.js';

//TODO: remove size here.
//only send the 1st image url
const getAllVehicles = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;

    if (page < 0) {
        return res.status(400).json({ message: "Page number cannot be negative" });
    }

    if (size < 0 || size > 100) {
        return res.status(400).json({ message: "Size must be between 1 and 100" });
    }

    try {
        const vehicleList = await findAllVehicles("DESC", page, size);

        await Promise.all(
            vehicleList.vehicles.map(async (vehicle) => {
                if (vehicle.images && vehicle.images.length > 0) {
                    vehicle.images = await getArrayOfImageUrls(vehicle.images, 3600);
                }
            })
        )

        res.status(200).json(vehicleList);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const getVehicleById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const vehicleId = parseInt(id);
    if (!id || isNaN(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({ message: "Invalid Id" });
    }

    try {
        const vehicle = await findVehicleById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
    
        if (vehicle.images && vehicle.images.length > 0) {
            vehicle.images = await getArrayOfImageUrls(vehicle.images, 3600);
        }
    
        return res.status(200).json(vehicle);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const searchVehicles = async (req: Request, res: Response) => {
    const searchRequest: searchRequest = req.body;

    if (!searchRequest || !searchRequest.searchField || !searchRequest.searchTerm) {
        return res.status(400).json({ message: "Search term, type and page no is required" });
    }

    const validSearchFields = ['brand', 'modelname', 'year', 'vehicletype', 'price', 'color', 'enginesize'];
    const searchField = searchRequest.searchField.toLowerCase();
    
    if (!validSearchFields.includes(searchField)) {
        return res.status(400).json({ message: "Invalid search field" });
    }

    try {
        const vehicleList = await findVehicleBySearchParam(searchRequest);
        
        await Promise.all(
            vehicleList.vehicles.map(async (vehicle) => {
                if (vehicle.images && vehicle.images.length > 0) {
                    vehicle.images = await getArrayOfImageUrls(vehicle.images, 3600);
                }
            })
        )

        res.status(200).json(vehicleList);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export { getAllVehicles, getVehicleById, searchVehicles }