import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeePage = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleVerify = () => {
    alert("SWIFT transactions banked!");
    navigate('/');
  };

  return (
    <div className='form_container transactions_table'>
      <h1>Transaction List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>SWIFT Code</th>
            <th>Card Number</th>
            <th>CVV</th>
            <th>Expire Date</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.name}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.currency}</td>
              <td>{transaction.swiftCode}</td>
              <td>{transaction.cardNumber}</td>
              <td>{transaction.cvv}</td>
              <td>{transaction.expireDate}</td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default EmployeePage;
