import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { Vehicle, VehicleList } from "../types/vehicle.types";

export const useVehicleService = () => {
    const axiosPrivate = useAxiosPrivate();

    return {
        getAllVehicles: async (page: number): Promise<{ vehicleList: VehicleList | null, status: number, message?: string }> => {
            const response = await axiosPrivate.get(`/admin/vehicle?page=${page}&size=1`);

            if (response.status !== 200) {
                return { vehicleList: null, status: response.status, message: response.data?.message };
            }

            return { vehicleList: response.data, status: response.status };
        },

        getVehicleById: async (id: number): Promise<{ vehicle: Vehicle | null, status: number, message?: string }> => {
            const response = await axiosPrivate.get(`/admin/vehicle/${id}`);
            
            if (response.status !== 200) {
                return { vehicle: null, status: response.status, message: response.data?.message };
            }
            
            return { vehicle: response.data, status: response.status };
        },
    }
}