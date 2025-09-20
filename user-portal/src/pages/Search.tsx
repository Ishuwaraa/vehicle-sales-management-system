import Navbar from "../components/shared/Navbar";
import { useState } from "react";
import { vehicleService } from "../services/vehicleService";
import { type VehicleList, type Vehicle } from "../types/vehicle.types";
import type { searchRequest } from "../types/search.types";

const Search = () => {
    const [vehicleData, setVehicleData] = useState<VehicleList>();
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [loadForInputChange, setLoadForInputChange] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchField, setSearchField] = useState<string>('brand');
    const [filterValue, setFilterValue] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('price');

    const searchVehicles = async (value: string, type: string, page: number = 0, append: boolean = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setCurrentPage(0);
            }

            const searchRequest: searchRequest = {
                searchTerm: value,
                searchField: type,
                page
            }
            const response = await vehicleService.searchVehicles(searchRequest);
    
            if (response.status !== 200) {
                console.error(response.message);
                return
            }
    
            const newVehicleData = response.vehicleList!;
            setVehicleData(newVehicleData);

            if (append) {
                setAllVehicles(prev => [...prev, ...newVehicleData.vehicles]);
            } else {
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
    
    const onSearchInputChange = (page: number = 0, append: boolean = false) => {
        if (searchTerm === '') {
            return;
        }

        if (searchField === 'year' && isNaN(Number(searchTerm))) {
            alert('Please enter a valid year (numbers only)');
            return;
        }

        searchVehicles(searchTerm, searchField, page, append);
        setLoadForInputChange(true);
    }

    const onFilterChange = (value: string, type: string, page: number = 0, append: boolean = false) => {
        searchVehicles(value, type, page, append);
        setLoadForInputChange(false);
        setFilterValue(value);
        setFilterType(type);
    }

    const loadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);

        loadForInputChange ? 
            onSearchInputChange(nextPage, true) : 
            onFilterChange(filterValue, filterType, nextPage, true);
    }

    const hasMoreData = vehicleData ? (currentPage < vehicleData.totalPages - 1) : false;

    return ( 
        <>
        <Navbar />
        <div>
            <div className="mb-5">
                <input type="text" value={searchTerm} required onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search vehicles"/>

                <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                    <option value="" disabled>Search by</option>
                    <option value="brand">Brand</option>
                    <option value="modelname">Model Name</option>
                    <option value="year">Year</option>
                    <option value="vehicletype">Vehicle Type</option>
                </select>

                <button onClick={() => onSearchInputChange()}>Search</button>
            </div>

            <div className="mb-10">
                <p>Filter By</p>
                <div className="mb-3">
                    <span className="mr-3">Price (Rs.)</span>
                    <label>
                        <input type="radio" name="filter" value="blue" onChange={() => onFilterChange('below 1000', 'price')} />
                        Below 1000
                    </label>
                    <label>
                        <input type="radio" name="filter" value="red" onChange={() => onFilterChange('1000-2000', 'price')} />
                        1000-2000
                    </label>
                    <label>
                        <input type="radio" name="filter" value="green" onChange={() => onFilterChange('above 2000', 'price')} />
                        Above 2000
                    </label>
                </div>
                <div className="mb-3">
                    <span className="mr-3">Color</span>
                    <label>
                        <input type="radio" name="filter" value="blue" onChange={() => onFilterChange('blue', 'color')} />
                        Blue
                    </label>
                    <label>
                        <input type="radio" name="filter" value="red" onChange={() => onFilterChange('red', 'color')} />
                        Red
                    </label>
                    <label>
                        <input type="radio" name="filter" value="green" onChange={() => onFilterChange('green', 'color')} />
                        Green
                    </label>
                </div>
                <div className="mb-3">
                    <span className="mr-3">Engine Size</span>
                    <label>
                        <input type="radio" name="filter" value="blue" onChange={() => onFilterChange('500cc', 'enginesize')} />
                        500cc
                    </label>
                    <label>
                        <input type="radio" name="filter" value="red" onChange={() => onFilterChange('700cc', 'enginesize')} />
                        700cc
                    </label>
                    <label>
                        <input type="radio" name="filter" value="green" onChange={() => onFilterChange('1000cc', 'enginesize')} />
                        1000cc
                    </label>
                </div>
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
                                    <a href={`/vehicle?id=${vehicle.id}`}>View Details</a>
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
        </div>
        </>
     );
}
 
export default Search;