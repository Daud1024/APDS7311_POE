import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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
      setError('Invalid account number');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, contain at least one letter and one number.');
      return;
    }

    setError(''); // Clear error if everything is valid

    try {
      const response = await axios.post('http://localhost:5000/api/cust/register', { email, accountNumber, password });
      if (response.status === 201) {
        setSuccessMessage('User registered successfully! You can now log in.');
        
        // Clear form fields after successful registration
        setEmail('');
        setPassword('');
        setAccountNumber('');

        // Navigate to the login page immediately after registration
        navigate('/');
      }
    } catch (err) {
      setError('Error registering user. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="form_container">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            placeholder='example@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="accountNumber">Account No.:</label>
          <input
            type="text"
            id="accountNumber"
            placeholder='Enter account number'
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default RegisterForm;
