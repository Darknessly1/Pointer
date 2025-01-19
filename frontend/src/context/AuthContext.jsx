import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser , setAuthUser ] = useState(() => {
        const storedUser  = localStorage.getItem("chat-user");
        return storedUser  ? JSON.parse(storedUser ) : null;
    });

    const login = (userData) => {
        localStorage.setItem("chat-user", JSON.stringify(userData));
        setAuthUser (userData);
    };

    const logout = () => {
        localStorage.removeItem("chat-user");
        setAuthUser (null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ authUser , login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};