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
  const { loginUser } = useAuth(); // Use loginUser from context


//Reference: TutorialsPoint
//Article Name: RegEx in ReactJS
//Link: https://www.tutorialspoint.com/regex-in-reactjs
//Author: Rahul Bansal
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const accountNumberRegex = /^\d+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Username:', email);
    console.log('Password:', password);
    console.log('Account Number', accountNumber);

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
      const response = await axios.post('http://localhost:5000/api/cust/login', { email, accountNumber, password });
      if (response.status === 200) {
        alert('Login successful!');
        
        // Save the user data in the context (assuming you get the user info from response)
        loginUser({ email, accountNumber }); 
        
        navigate('/payment_page'); // Navigate to the payment page
      }
    } catch (err) {
      setError('Invalid email, account number, or password.');
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
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <div className="register-link">
        <p>Don't have an account? <Link to="/user_register">Register here</Link>.</p>
      </div>
        <Link className='Link' to={'/employee_login'}></Link>
    </div>
  );
}

export default LoginForm;
