import { useLocation } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import { useEffect, useState } from "react";
import { vehicleService } from "../services/vehicleService";
import { type Vehicle } from "../types/vehicle.types";

const VehicleDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const vehicleId = searchParams.get('id');

    const [loading, setLoading] = useState<boolean>(false);
    const [vehicle, setVehicle] = useState<Vehicle | null>();

    const getVehicleData = async () => {
        if (!vehicleId) {
            console.warn('No vehicle id');
            return;
        }

        const id = parseInt(vehicleId);
        if (isNaN(id) || id <= 0) {
            console.error('Invalid vehicle id');
            return;
        }

        try {
            setLoading(true);

            const response = await vehicleService.getVehicleById(id);

            if (response.status !== 200) {
                console.error(response.message);
                return
            }

            setVehicle(response.vehicle);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getVehicleData();
    }, [vehicleId])

    if (loading) {
        return (
            <>
                <Navbar />
                <div>Loading vehicle details...</div>
            </>
        );
    }

    return ( 
        <>
            <Navbar />
            <div>
                <h1>Vehicle Details</h1>
                {vehicle ? (
                    <div>
                        <p>ID: {vehicle.id}</p>
                        <p>Brand: {vehicle.brand}</p>
                        <p>Type: {vehicle.vehicleType}</p>
                        <p>Model: {vehicle.modelName}</p>
                        <p>Year: {vehicle.year}</p>
                        <p>Price: Rs. {vehicle.price}</p>
                        <p>Color: {vehicle.color}</p>
                        <p>Engine Size: {vehicle.engineSize}</p>
                        <p>Description: {vehicle.description}</p>
                        {(vehicle.images && vehicle.images?.length > 0) && (
                            vehicle.images.map((image, index) => (
                                <div key={index}>
                                    <a href={`${image}`}>image</a>
                                </div>
                            ))
                        )}

                        <p>Contact Us</p>
                    </div>
                ) : (
                    <div>Vehicle not found</div>
                )}
            </div>
        </>
     );
}
 
export default VehicleDetails;