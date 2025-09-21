import Navbar from "../components/shared/Navbar";
import { useState } from "react";
import { vehicleService } from "../services/vehicleService";
import { type VehicleList, type Vehicle } from "../types/vehicle.types";
import type { searchRequest } from "../types/search.types";
import { Search as SearchIcon, Filter, Car } from "lucide-react";
import VehicleCard from "../components/VehicleCard";

const Search = () => {
    const [vehicleData, setVehicleData] = useState<VehicleList>();
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [loadForInputChange, setLoadForInputChange] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Vehicles</h1>
                    <p className="text-gray-600">Find your perfect vehicle using our search and filter options</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search vehicles..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select 
                                value={searchField} 
                                onChange={(e) => setSearchField(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                            >
                                <option value="brand">Brand</option>
                                <option value="modelname">Model Name</option>
                                <option value="year">Year</option>
                                <option value="vehicletype">Vehicle Type</option>
                            </select>
                        </div>
                        <button 
                            onClick={() => onSearchInputChange()}
                            disabled={!searchTerm}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <Filter className="h-5 w-5 text-gray-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Filter By</h2>
                    </div>
                    
                    {/* Price Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Price (Rs.)</h3>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="below 1000" 
                                    onChange={() => onFilterChange('below 1000', 'price')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Below 1000</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="1000-2000" 
                                    onChange={() => onFilterChange('1000-2000', 'price')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">1000-2000</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="above 2000" 
                                    onChange={() => onFilterChange('above 2000', 'price')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Above 2000</span>
                            </label>
                        </div>
                    </div>

                    {/* Color Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Color</h3>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="blue" 
                                    onChange={() => onFilterChange('blue', 'color')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Blue</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="red" 
                                    onChange={() => onFilterChange('red', 'color')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Red</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="green" 
                                    onChange={() => onFilterChange('green', 'color')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Green</span>
                            </label>
                        </div>
                    </div>

                    {/* Engine Size Filter */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Engine Size</h3>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="500cc" 
                                    onChange={() => onFilterChange('500cc', 'enginesize')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">500cc</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="700cc" 
                                    onChange={() => onFilterChange('700cc', 'enginesize')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">700cc</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    value="1000cc" 
                                    onChange={() => onFilterChange('1000cc', 'enginesize')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">1000cc</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-lg text-gray-600">Searching vehicles...</span>
                    </div>
                ) : (
                    <div>
                        {allVehicles.length > 0 ? (
                            <>
                                {/* Results Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                                        {vehicleData?.total && (
                                            <p className="text-gray-600 mt-1">
                                                Found {vehicleData.total} vehicles
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
                                            Grid
                                        </button>
                                    </div>
                                </div>

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
                                    {hasMoreData ? (
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
                                    ) : allVehicles.length > 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 text-lg">You've seen all search results!</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : searchTerm || filterValue ? (
                            <div className="text-center py-16">
                                <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                                <p className="text-gray-600">Try adjusting your search terms or filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
                                <p className="text-gray-600">Enter keywords or use filters to find the perfect vehicle for you.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default Search;