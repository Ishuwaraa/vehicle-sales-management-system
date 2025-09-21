import type { Vehicle } from "../types/vehicle.types";
import PlaceholderImg from "../assets/placeholder.jpg";

interface VehicleCardProps {
    vehicle: Vehicle;
    viewMode: string;
}

const VehicleCard = ({ vehicle, viewMode }: VehicleCardProps) => {
    const thumbnailImage = vehicle.images?.[0] || PlaceholderImg;
    
    if (viewMode === 'grid') {
        return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                    <img 
                        src={thumbnailImage}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        Rs. {vehicle.price}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {vehicle.brand} {vehicle.modelName}
                    </h3>
                    <a 
                        href={`/vehicle?id=${vehicle.id}`}
                        className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                    >
                        View Details
                    </a>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4">
            <div className="flex">
                <div className="w-48 h-32 flex-shrink-0">
                    <img 
                        src={thumbnailImage}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 p-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {vehicle.brand} {vehicle.modelName}
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">
                            Rs. {vehicle.price}
                        </p>
                    </div>
                    <div className="ml-4">
                        <a 
                            href={`/vehicle?id=${vehicle.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-200 font-medium"
                        >
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;