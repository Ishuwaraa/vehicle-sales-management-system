import { Request, Response } from 'express';
import { AddVehicle, UpdateVehicle } from '../types/vehicle.types.js';
import { deleteImages, getArrayOfImageUrls } from '../middlewares/awsMiddleware.js';
import { createVehicle, deleteVehicleById, findAllVehicles, findVehicleById, updateVehicleById } from '../repositories/vehicleRepository.js';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const getAllVehicles = async (req: Request, res: Response) => {
    const sortBy = (req.query.sortBy as string) || "DESC";
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;

    if (page < 0) {
        return res.status(400).json({ message: "Page number cannot be negative" });
    }

    if (size < 0 || size > 100) {
        return res.status(400).json({ message: "Size must be between 1 and 100" });
    }

    try {
        const vehicleList = await findAllVehicles(sortBy, page, size);

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

//TODO: improve guardrails
const generateAIDescription = async (req: Request, res: Response) => {
    const vehicle: AddVehicle = req.body;

    try {
        const response = await client.responses.create({
            model: "gpt-4.1-nano",
            instructions: `
                You are a professional vehicle sales assistant in Sri Lanka. 
                Write short, persuasive, and creative sales descriptions for vehicles listed for sale. 
                Mention the brand, model, year, engine size, color, and highlight key selling points like fuel efficiency, performance, or reliability.
                Rules:
                    - Only use the details provided.
                    - Do not invent or assume extra specifications.
                    - Keep it professional but friendly, under 80 words.
                    - Use LKR for the price.
            `,
            input: `
                Generate a sales description for this vehicle:
                - Type: ${vehicle.vehicleType}
                - Brand: ${vehicle.brand}
                - Model: ${vehicle.modelName}
                - Color: ${vehicle.color}
                - Engine Size: ${vehicle.engineSize}
                - Year: ${vehicle.year}
                - Price: LKR${vehicle.price}.
                Write it like a car dealership would advertise it to attract buyers.
            `,
        });

        res.status(200).json({ description: response.output_text })
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const addVehicle = async (req: Request, res: Response) => {
    const data: AddVehicle = req.body;
    const imageFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    const images: string[] = [];

    if (imageFiles && Array.isArray(imageFiles)) {
        imageFiles.forEach((file) => {
            images.push(file.key);
        });
    }

    try {
        const vehicle = await createVehicle({
            vehicleType: data.vehicleType,
            brand: data.brand,
            modelName: data.modelName,
            color: data.color,
            engineSize: data.engineSize,
            year: data.year,
            price: data.price,
            description: data.description,
            images
        })
        if (!vehicle) return res.status(500).json({ message: "Error adding the vehicle"});

        res.status(201).json(vehicle);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: UpdateVehicle = req.body;

    const vehicleId = parseInt(id);
    if (!id || isNaN(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({ message: "Invalid Id" });
    }

    try {
        const vehicle = await updateVehicleById(vehicleId, data);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json(vehicle);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

//update vehicle images

const deleteVehicle = async (req: Request, res: Response) => {
    const { id } = req.params;

    const vehicleId = parseInt(id);
    if (!id || isNaN(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({ message: "Invalid Id" });
    }

    try {
        const result = await deleteVehicleById(vehicleId);
    
        if (!result.deleted) {
            if (result.message === "Vehicle not found") {
                return res.status(404).json({ message: "Vehicle not found" });
            }
    
            return res.status(500).json({ message: result.message });
        }
    
        if (result.images.length > 0) {
            await deleteImages(result.images);
        }
    
        return res.status(200).json({ message: result.message });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export { getAllVehicles, getVehicleById, generateAIDescription, addVehicle, updateVehicle, deleteVehicle }