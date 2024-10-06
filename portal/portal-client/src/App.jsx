import { useState } from 'react';
import LoginForm from './Login';
import './App.css';
import { UserProtectedRoute, EmployeeProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import EmployeeLogin from './EmployeeLogin';
import ClientPayment from './ClientPayment';
import EmployeePage from './EmployeePage';
import EmployeeRegister from './EmployeeRegister';
import RegisterForm from './ClientRegister';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    // Wrap everything inside the AuthProvider
    //Reference: Medium
     //Article Name: Implementing Protected Routes In React 
     //Link: https://medium.com/@yogeshmulecraft/implementing-protected-routes-in-react-js-b39583be0740
     //Author: Yogesh Manikkavasagam
    <AuthProvider>
      <BrowserRouter>
        <div className="header">
          <h1>
            The Portal
          </h1>
        </div>
        <Routes>
          {/* Public Route */}
          <Route path='/' element={<LoginForm />} />

          {/* Protected Route for Client Payment (User) */}
          <Route path="/payment_page" element={
            <UserProtectedRoute>
              <ClientPayment />
            </UserProtectedRoute>
          } />

          {/* Public Route for Employee Login */}
          <Route path='/employee_login' element={<EmployeeLogin />} />

          {/* Protected Route for Employee Page (Employee) */}
          <Route path='/employee_page' element={
            <EmployeeProtectedRoute>
              <EmployeePage />
            </EmployeeProtectedRoute>
          } />

          {/* uncomment for part 3 */}
          {<Route path="/user_register" element={<RegisterForm />} /> }
          { <Route path="/register" element={<EmployeeRegister />} />}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
