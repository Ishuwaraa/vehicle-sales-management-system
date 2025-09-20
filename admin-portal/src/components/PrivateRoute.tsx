import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { ReactElement } from "react";

interface PrivateRouteProps {
    element: ReactElement;
}

const Loading = () => {
    return ( 
        <div>Loading...</div>
     );
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { auth, loading }: any = useAuth();
    const location = useLocation();

    if(loading) return <Loading />

    return auth?.accessToken ? element : <Navigate to='/login' state={{ from: location }} replace />
}

export default PrivateRoute;