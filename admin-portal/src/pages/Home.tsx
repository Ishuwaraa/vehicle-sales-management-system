import { useEffect, useState } from "react";
import { useVehicleService } from "../services/vehicleService";
import Navbar from "../components/shared/Navbar";
import type { Vehicle, VehicleList } from "../types/vehicle.types";
import { Grid, List, Car } from "lucide-react";
import VehicleCard from "../components/VehicleCard";

const Home = () => {
    const vehicleService = useVehicleService();

    const [vehicleData, setVehicleData] = useState<VehicleList>();
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('DESC');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    
    const getAllVehicles = async (page: number = 0, append: boolean = false, sortBy: string = 'DESC') => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await vehicleService.getAllVehicles(page, sortBy);
    
            if (response.status !== 200) {
                console.error(response.message);
                return
            }
    
            const newVehicleData = response.vehicleList!;
            setVehicleData(newVehicleData);

            if (append) {
                //append pagination sets
                setAllVehicles(prev => [...prev, ...newVehicleData.vehicles]);
            } else {
                //initial list
                setAllVehicles(newVehicleData.vehicles);
            }
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const loadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getAllVehicles(nextPage, true, sortBy);
    }

    const hasMoreData = vehicleData ? (currentPage < vehicleData.totalPages - 1) : false;

    const onSortByChange = (value: string, page: number = 0, append: boolean = false) => {
        setCurrentPage(0);
        setSortBy(value);
        getAllVehicles(page, append, value);
    }

    useEffect(() => {
        getAllVehicles();
    }, [])

    return ( 
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Vehicles</h1>
                        {vehicleData?.total && (
                            <p className="text-gray-600 mt-1">
                                Showing {allVehicles.length} of {vehicleData.total} vehicles
                            </p>
                        )}
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <List className="h-4 w-4 mr-1" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Grid className="h-4 w-4 mr-1" />
                            Grid
                        </button>
                    </div>
                </div>

                <div className="flex mb-5 justify-end">
                    <div>
                        <select 
                            value={sortBy} 
                            onChange={(e) => onSortByChange(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                        >
                            <option value="" disabled>Sort By</option>
                            <option value="DESC">Latest</option>
                            <option value="ASC">Oldest</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-lg text-gray-600">Loading vehicles...</span>
                    </div>
                ) : (
                    <div>
                        {allVehicles.length > 0 ? (
                            <>
                                {/* Vehicle Grid/List */}
                                <div className={
                                    viewMode === 'grid' 
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "space-y-4"
                                }>
                                    {allVehicles.map((vehicle: Vehicle) => (
                                        <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
                                    ))}
                                </div>
                                
                                {/* Load More Button */}
                                <div className="flex justify-center mt-12">
                                    {hasMoreData && (
                                        <button 
                                            onClick={loadMore}
                                            disabled={loadingMore}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
                                        >
                                            {loadingMore && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            )}
                                            {loadingMore ? 'Loading...' : 'Load More Vehicles'}
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles added yet</h3>
                                <button
                                    onClick={() => window.location.href = '/vehicle/add'}
                                    className="px-3 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover: cursor-pointer"
                                >
                                    Add Vehicle
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Home;