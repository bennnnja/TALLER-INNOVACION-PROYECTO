import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Mantiene el usuario en memoria

    // Función para cerrar sesión
    const logout = () => {
        setUser(null); // Limpia los datos del usuario
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
