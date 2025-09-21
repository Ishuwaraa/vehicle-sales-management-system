import { AxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { AddVehicleRequest, Vehicle, VehicleList } from "../types/vehicle.types";

export const useVehicleService = () => {
    const axiosPrivate = useAxiosPrivate();

    return {
        getAllVehicles: async (page: number, sortBy: string = 'DESC'): Promise<{ vehicleList: VehicleList | null, status: number, message?: string }> => {
            try {
                const response = await axiosPrivate.get(`/admin/vehicle?sortBy=${sortBy}&page=${page}&size=1`);
    
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
                const response = await axiosPrivate.get(`/admin/vehicle/${id}`);
                
                return { vehicle: response.data, status: response.status };
            } catch (err: any) {
                console.log(err.response);

                if (err instanceof AxiosError) {
                    return { vehicle: null, status: err.response!.status, message: err.response!.data.message };
                }

                return { vehicle: null, status: err.response.status, message: err.message };
            }
        },

        addVehicle: async (formData: FormData): Promise<{ vehicle: Vehicle | null, status: number, message?: string }> => {
            try {
                const response = await axiosPrivate.post('/admin/vehicle', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                return { vehicle: response.data, status: response.status };
            } catch (err: any) {
                console.log(err.response);

                if (err instanceof AxiosError) {
                    return { vehicle: null, status: err.response!.status, message: err.response!.data.message };
                }

                return { vehicle: null, status: err.response.status, message: err.message };
            }
        }, 

        generateAIDescription: async (addVehicleRequest: Partial<AddVehicleRequest>): Promise<{ description: string | null, status: number, message?: string }> => {
            try {
                const response = await axiosPrivate.post('/admin/vehicle/generate', addVehicleRequest);

                return { description: response.data.description, status: response.status };
            } catch (err: any) {
                console.log(err.response);

                if (err instanceof AxiosError) {
                    return { description: null, status: err.response!.status, message: err.response!.data.message };
                }

                return { description: null, status: err.response.status, message: err.message };
            }
        }
    }
}