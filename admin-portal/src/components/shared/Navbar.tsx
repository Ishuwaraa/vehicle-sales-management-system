import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

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
        <div>
            <a href="/" className="mr-3">Home</a>
            <a href="/vehicle/add">Add Vehicle</a>
            <button onClick={onLogoutBtnClick}>Logout</button>
        </div>
     );
}
 
export default Navbar;