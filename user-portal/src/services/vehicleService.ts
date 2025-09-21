import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import type { searchRequest } from "../types/search.types";
import type { Vehicle, VehicleList } from "../types/vehicle.types";

export const vehicleService = {
    getAllVehicles: async (page: number): Promise<{ vehicleList: VehicleList | null, status: number, message?: string }> => {
        try {
            const response = await axiosInstance.get(`/vehicle?page=${page}&size=5`);
    
            return { vehicleList: response.data, status: response.status };
        } catch (err: any) {
            console.log(err.response);

            if (err instanceof AxiosError) {
                return { vehicleList: null, status: err.response!.status, message: err.response!.data.message };
            }

            return { vehicleList: null, status: err.response.status, message: err.message };
        }
    },

    getVehicleById: async (id: number): Promise<{ vehicle: Vehicle | null, status: number, message?: string }> => {
        try {
            const response = await axiosInstance.get(`/vehicle/${id}`);
            
            return { vehicle: response.data, status: response.status };
        } catch (err: any) {
            console.log(err.response);

            if (err instanceof AxiosError) {
                return { vehicle: null, status: err.response!.status, message: err.response!.data.message };
            }

            return { vehicle: null, status: err.response.status, message: err.message };
        }
    },

    searchVehicles: async (searchRequest: searchRequest): Promise<{ vehicleList: VehicleList | null, status: number, message?: string }> => {
        try {
            const response = await axiosInstance.post('/vehicle/search', searchRequest);
    
            return { vehicleList: response.data, status: response.status };
        } catch (err: any) {
            console.log(err.response);

            if (err instanceof AxiosError) {
                return { vehicleList: null, status: err.response!.status, message: err.response!.data.message };
            }

            return { vehicleList: null, status: err.response.status, message: err.message };
        }
    }
}