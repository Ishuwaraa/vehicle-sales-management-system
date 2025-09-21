import { useEffect, useState, type FormEvent } from "react";
import Navbar from "../components/shared/Navbar";
import { useVehicleService } from "../services/vehicleService";
import type { AddVehicleRequest, UpdateVehicleRequest } from "../types/vehicle.types";
import { useLocation, useNavigate } from "react-router-dom";
import PlaceholderImg from "../assets/placeholder.jpg";
import { Edit, Trash2, Sparkles } from "lucide-react";

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
    const [loading, setLoading] = useState<boolean>(false);

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
            setLoading(true);
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
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Vehicle</h1>
                    <p className="text-gray-600">Update vehicle information and details</p>
                </div>

                {/* Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {images && images.length > 0 ? (
                            images.map((image, index) => (
                                <div key={index} className="aspect-video w-full max-w-xs">
                                    <img 
                                        src={image}
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                            ))
                        ) : (
                            Array(4).fill(0).map((_, index) => (
                                <div key={index} className="aspect-video w-full max-w-xs">
                                    <img 
                                        src={PlaceholderImg} 
                                        alt="Placeholder"
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Details</h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle type" 
                                    value={vehicleType} 
                                    required 
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle brand" 
                                    value={brand} 
                                    required 
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle model name" 
                                    value={modelName} 
                                    required 
                                    onChange={(e) => setModelName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle color" 
                                    value={color} 
                                    required 
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter vehicle engine size" 
                                    value={engineSize} 
                                    required 
                                    onChange={(e) => setEngineSize(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter vehicle year" 
                                    value={year} 
                                    required 
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter vehicle price" 
                                    value={price} 
                                    required 
                                    onChange={(e) => setPrice(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <button 
                                    type="button" 
                                    onClick={() => getAIDescription()}
                                    disabled={loading}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:cursor-pointer"
                                >
                                    <Sparkles className="h-4 w-4 mr-1" />
                                    {loading ? 'Generating...' : 'Generate AI Description'}
                                </button>
                            </div>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                rows={4} 
                                placeholder="Vehicle description"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button 
                            type="button" 
                            onClick={deleteVehicle}
                            className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Vehicle
                        </button>
                        <button 
                            type="submit"
                            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Update Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default EditVehicle;