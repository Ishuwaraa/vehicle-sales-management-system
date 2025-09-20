import { useEffect } from "react";
import { useVehicleService } from "../services/vehicleService";

const Home = () => {
    const vehicleService = useVehicleService();

    const getAllVehicles = async () => {
        try {
            const response = await vehicleService.getAllVehicles(0);
            console.log(response.vehicleList);
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    useEffect(() => {
        getAllVehicles();
    }, [])

    return ( 
        <div className="text-xl text-blue-500">Hello world!</div>
     );
}
 
export default Home;