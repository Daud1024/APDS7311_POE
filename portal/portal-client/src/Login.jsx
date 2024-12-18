import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Regex for validation
//Reference: TutorialsPoint
//Article Name: RegEx in ReactJS
//Link: https://www.tutorialspoint.com/regex-in-reactjs
//Author: Rahul Bansal
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const accountNumberRegex = /^\d+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    if (!accountNumberRegex.test(accountNumber)) {
      setError('Invalid account number.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, contain at least one letter and one number.');
      return;
    }

    setError(''); // Clear error if everything is valid

    try {
      const response = await axios.post('http://localhost:5000/api/cust/login', { email, accountNumber, password });
      if (response.status === 200) {
        alert('Login successful!');
        loginUser({ email, accountNumber });
        navigate('/payment_page');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email, account number, or password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error(err);
    }
  };

  return (
    <div className="form_container">
      <h3>Please Login</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(''); // Clear error on change
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="accountNumber">Account No.:</label>
          <input
            type="text"
            id="accountNumber"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              if (error) setError('');
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <div className="register-link">
        <p>Are you an employee? <Link to="/employee_login">Login here</Link>.</p>
        <p>Don't have an account? <Link to="/user_register">Register here</Link>.</p>
      </div>
    </div>
  );
}

export default LoginForm;
