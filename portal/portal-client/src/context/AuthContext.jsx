// src/context/AuthContext.js
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // `user` is for regular user
    const [employee, setEmployee] = useState(null); // `employee` is for employee

    const loginUser = (userData) => {
        setUser(userData);
    };

    const loginEmployee = (employeeData) => {
        setEmployee(employeeData);
    };

    const logout = () => {
        setUser(null);
        setEmployee(null);
    };

    return (
        <AuthContext.Provider value={{ user, employee, loginUser, loginEmployee, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
