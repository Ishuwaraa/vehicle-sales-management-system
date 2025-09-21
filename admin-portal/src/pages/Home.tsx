import { useEffect, useState } from "react";
import { useVehicleService } from "../services/vehicleService";
import Navbar from "../components/shared/Navbar";
import type { Vehicle, VehicleList } from "../types/vehicle.types";

const Home = () => {
    const vehicleService = useVehicleService();

    const [vehicleData, setVehicleData] = useState<VehicleList>();
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('DESC');
    
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
        <>
        <Navbar />
        <div className=" text-2xl text-blue-500">All Vehicles</div>

        <div>
            <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
                <option value="" disabled>Sort by</option>
                <option value="DESC">Latest</option>
                <option value="ASC">Oldest</option>
            </select>
        </div>

        {loading ? (
            <div>loading vehicles</div>
        ) : (
            <div>
                {allVehicles.length > 0 ? (
                    <div>
                        <p>total vehicles: {vehicleData?.total}</p>
                        {allVehicles.map((vehicle: Vehicle) => (
                            <div key={vehicle.id} className="mb-5">
                                <span className="mr-3">{vehicle.id} | {vehicle.modelName} | {vehicle.price} | {vehicle.brand}</span>
                                <a href={`/vehicle/edit?id=${vehicle.id}`}>edit vehicle</a>
                            </div>
                        ))}
                        
                        {hasMoreData && (
                            <button 
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        )}

                        {!hasMoreData && allVehicles.length > 0 && (
                            <p className="mt-4 text-gray-500">No more vehicles to load</p>
                        )}
                    </div>
                ) : (
                    <div>No vehicles found</div>
                )}
            </div>
        )}
    </>
     );
}
 
export default Home;