import { axiosInstance } from "../lib/axios";
import type { searchRequest } from "../types/search.types";
import type { Vehicle, VehicleList } from "../types/vehicle.types";

export const vehicleService = {
    getAllVehicles: async (page: number): Promise<{ vehicleList: VehicleList | null, status: number, message?: string }> => {
        const response = await axiosInstance.get(`/vehicle?page=${page}&size=1`);

        if (response.status !== 200) {
            return { vehicleList: null, status: response.status, message: response.data?.message };
        }

        return { vehicleList: response.data, status: response.status };
    },

    getVehicleById: async (id: number): Promise<{ vehicle: Vehicle | null, status: number, message?: string }> => {
        const response = await axiosInstance.get(`/vehicle/${id}`);
        
        if (response.status !== 200) {
            return { vehicle: null, status: response.status, message: response.data?.message };
        }
        
        return { vehicle: response.data, status: response.status };
    },

    searchVehicles: async (searchParams: searchRequest): Promise<{ vehicles: VehicleList | null, status: number, message?: string }> => {
        const response = await axiosInstance.post(`/vehicle/search?page=${searchParams.page}&size=1`, { data: searchParams });

        if (response.status !== 200) {
            return { vehicles: null, status: response.status, message: response.data?.message };
        }

        return { vehicles: response.data, status: response.status };
    }
}