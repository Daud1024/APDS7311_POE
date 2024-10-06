// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protected route for regular users
export const UserProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        alert("Please Login");
        return <Navigate to="/" />; // Redirect to user login if not logged in
        
    }

    return children;
};

// Protected route for employees
export const EmployeeProtectedRoute = ({ children }) => {
    const { employee } = useAuth();

    if (!employee) {
        alert("please login");
        return <Navigate to="/" />; // Redirect to employee login if not logged in
    }

    return children;
};
