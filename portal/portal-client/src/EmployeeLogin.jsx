import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { loginEmployee } = useAuth(); // Use loginEmployee from context

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password === '') {
      setErrorMessage('Please enter a password.');
      return;
    }

    // If validation passes
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/emp/login', { email, password });
      if (response.status === 200) {
        alert('Login successful!');
        
        // Save the employee data in the context
        loginEmployee({ email }); 
        
        navigate('/employee_page'); // Navigate to the transaction list
      }
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className='form_container'>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder='example@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default EmployeeLogin;
