import { useEffect, useState, type FormEvent } from "react";
import Navbar from "../components/shared/Navbar";
import { useVehicleService } from "../services/vehicleService";
import type { AddVehicleRequest, UpdateVehicleRequest } from "../types/vehicle.types";
import { useLocation, useNavigate } from "react-router-dom";

const EditVehicle = () => {
    const vehicleService = useVehicleService();

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const vehicleId = searchParams.get('id');
    
    const [images, setImages] = useState<string[]>([]);
    const [vehicleType, setVehicleType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [modelName, setModelName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [engineSize, setEngineSize] = useState<string>('');
    const [year, setYear] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!vehicleId) {
            console.warn('No vehicle id');
            return;
        }

        const id = parseInt(vehicleId);
        if (isNaN(id) || id <= 0) {
            console.error('Invalid vehicle id');
            return;
        }

        const editVehicleRequest: UpdateVehicleRequest = {
            vehicleType,
            brand,
            modelName,
            color,
            engineSize,
            year,
            price,
            description
        }

        try {
            const response = await vehicleService.editVehicle(editVehicleRequest, id);

            if (response.status !== 200) {
                alert('Error updating vehicle');
                return;
            }

            alert('vehicle updated successfully');
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

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
            const response = await vehicleService.getVehicleById(id);

            if (response.status !== 200) {
                alert('Error fetching data');
                return;
            }

            const vehicle = response.vehicle!;
            setImages(vehicle.images || [])
            setVehicleType(vehicle.vehicleType)
            setBrand(vehicle.brand)
            setModelName(vehicle.modelName)
            setColor(vehicle.color)
            setEngineSize(vehicle.engineSize)
            setYear(vehicle.year)
            setPrice(vehicle.price)
            setDescription(vehicle.description)
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    const getAIDescription = async () => {
        if (!vehicleType || !brand || !modelName || !color || !engineSize || !year || !price) {
            alert('All fields are required');
            return;
        }

        try {
            const data: Partial<AddVehicleRequest> = {
                vehicleType,
                brand,
                modelName,
                color,
                engineSize,
                year,
                price
            }
            const response = await vehicleService.generateAIDescription(data)
            
            if (response.status !== 200) {
                console.error(response.message);
                return;
            }

            setDescription(response.description!);
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    const deleteVehicle = async () => {
        if (!vehicleId) {
            console.warn('No vehicle id');
            return;
        }

        const id = parseInt(vehicleId);
        if (isNaN(id) || id <= 0) {
            console.error('Invalid vehicle id');
            return;
        }

        if (confirm('Are you sure you want to delete this vehicle')) {
            try {
                const response = await vehicleService.deleteVehicle(id);
                console.log(response);
    
                if (response.status !== 200) {
                    alert('Error fetching data');
                    return;
                }
    
                alert('Vehicle deleted successfully');
                navigate('/', { replace: true });
            } catch (err: any) {
                if (err.response.status === 500) {
                    console.error(err.response?.data?.message)
                } else {
                    console.error(err.message);
                }
            }
        }
    }

    useEffect(() => {
        getVehicleData();
    }, [])

    return ( 
        <>
        <Navbar />

        <div>
            <button onClick={() => getAIDescription()}>Generate Description</button>
        </div>

        <div>
            {/* {images.length > 0 && (
                images.map((image, index) => (
                    <p key={index}>{image}</p>
                ))
            )} */}
        </div>

        <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Vehicle Images</h3>
                
            </div>

            <input type="text" placeholder="enter vehicle type" value={vehicleType} required onChange={(e) => setVehicleType(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle brand" value={brand} required onChange={(e) => setBrand(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle model name" value={modelName} required onChange={(e) => setModelName(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle color" value={color} required onChange={(e) => setColor(e.target.value)}/><br />
            <input type="text" placeholder="enter vehicle engine size" value={engineSize} required onChange={(e) => setEngineSize(e.target.value)}/><br />
            <input type="number" placeholder="enter vehicle year" value={year} required onChange={(e) => setYear(parseInt(e.target.value))}/><br />
            <input type="number" placeholder="enter vehicle price" value={price} required onChange={(e) => setPrice(parseInt(e.target.value))}/><br />

            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} placeholder="AI description"/><br />

            <button type="button" onClick={deleteVehicle}>Delete Vehicle</button>
            <button type="submit">Edit Vehicle</button>
        </form>
        </>
     );
}
 
export default EditVehicle;