import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem('token');
        return savedAuth ? JSON.parse(savedAuth) : { accessToken: null }
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('token', JSON.stringify(auth));
    }, [auth]);

    useEffect(() => {
        const savedAuth = localStorage.getItem('token');
        if (savedAuth) {
          setAuth(JSON.parse(savedAuth));
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;