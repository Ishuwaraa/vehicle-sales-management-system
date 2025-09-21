import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Car, Home } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    
    const onLogoutBtnClick = async () => {
        try {
            const response = await authService.logout();

            if (response.status !== 200) {
                console.error(response.message);
                return
            }
            navigate('/login', { replace: true });
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center hover:cursor-pointer" onClick={() => window.location.href = '/'}>
                        <Car className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-900">AutoDeals</span>
                    </div>
                    <div className="flex space-x-4">
                        <a 
                            href="/" 
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        >
                            <Home className="h-4 w-4 mr-1" />
                            Home
                        </a>
                        <a 
                            href="/vehicle/add" 
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        >
                            {/* <Search className="h-4 w-4 mr-1" /> */}
                            Add Vehicle
                        </a>
                        <button
                            onClick={onLogoutBtnClick}
                            className="px-3 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover: cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
     );
}
 
export default Navbar;