import { useLocation } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import { useEffect, useState } from "react";
import { vehicleService } from "../services/vehicleService";
import { type Vehicle } from "../types/vehicle.types";
import { Car, Calendar, Palette, Settings } from "lucide-react";
import PlaceholderImg from "../assets/placeholder.jpg";

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
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getVehicleData();
    }, [vehicleId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-lg text-gray-600">Loading vehicle details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {vehicle ? (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {vehicle.brand} {vehicle.modelName}
                            </h1>
                        </div>

                        {/* Images Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                {vehicle.images && vehicle.images.length > 0 ? (
                                    vehicle.images.map((image, index) => (
                                        <div key={index} className="aspect-video">
                                            <img 
                                                src={image} 
                                                alt={`${vehicle.brand} ${vehicle.modelName} - Image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <div key={index} className="aspect-video">
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

                        {/* Vehicle Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center">
                                    <Car className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Vehicle Type</p>
                                        <p className="font-medium text-gray-900">{vehicle.vehicleType}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Year</p>
                                        <p className="font-medium text-gray-900">{vehicle.year}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <Palette className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Color</p>
                                        <p className="font-medium text-gray-900">{vehicle.color}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <Settings className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Engine Size</p>
                                        <p className="font-medium text-gray-900">{vehicle.engineSize}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price & Description */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Price</h2>
                                </div>
                                <p className="text-3xl font-bold text-blue-600">Rs. {vehicle.price}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700">{vehicle.description || 'No description available.'}</p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8 text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Interested in this vehicle?</h2>
                            <p className="text-gray-600 mb-4">Contact us for more information or to schedule a viewing</p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                                Contact Us
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle not found</h3>
                        <p className="text-gray-600">The vehicle you're looking for doesn't exist or has been removed.</p>
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default VehicleDetails;