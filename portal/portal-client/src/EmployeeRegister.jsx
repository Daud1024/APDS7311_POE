import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const EmployeeRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/api/emp/register', { email, password });
      if (response.status === 201) {
        setSuccessMessage('Employee registered successfully! You can now log in.');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setErrorMessage('Error registering employee. Please try again.');
    }
  };

  return (
    <div className='form_container'>
      <h2>Employee Register</h2>
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
        <button type="submit">Register</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default EmployeeRegister;
