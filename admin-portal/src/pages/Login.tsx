import { useState } from "react";
import { authService } from "../services/authService";
import type { UserLogin } from "../types/user.types";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const { setAuth }: any = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        try {
            const loginRequest: UserLogin = {
                email, 
                password
            }
            const response = await authService.login(loginRequest);
            console.log('response ', response)

            if (response.status !== 200) {
                console.error(response.message);
                return
            }

            const accessToken = response.user!.accessToken;
            setAuth({ accessToken: accessToken })

            navigate(from, { replace: true });
        } catch (err: any) {
            if (err.response.status === 500) {
                console.error(err.response?.data?.message)
            } else {
                console.error(err.message);
            }
        }
    }

    return ( 
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="email" placeholder="enter email" required onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="enter password" required onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Login" />
            </form>
        </>
     );
}
 
export default Login;