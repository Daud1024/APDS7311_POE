import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientPayment = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'ZAR',
    swiftCode: '',
    cardNumber: '',
    cvv: '',
    expireDate: '',
  });
  const [errors, setErrors] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const navigate = useNavigate();

  const currencies = ['ZAR', 'USD', 'EUR', 'GBP'];

  // Regex patterns
  //Reference: TutorialsPoint
  //Article Name: RegEx in ReactJS
  //Link: https://www.tutorialspoint.com/regex-in-reactjs
  //Author: Rahul Bansal
  const regexPatterns = {
    name: /^[a-zA-Z\s]+$/,
    amount: /^\d+(\.\d{1,2})?$/, // Numeric value with up to 2 decimal places
    swiftCode: /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/, // SWIFT code pattern
    cardNumber: /^\d{16}$/, // 16-digit credit card number
    cvv: /^\d{3}$/, // 3-digit CVV
    expireDate: /^(0[1-9]|1[0-2])\/\d{2}$/, // Expiration date in MM/YY format
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate fields using regex

  //Reference: ScientyficWorld
  //Article Name: How to use Regex in React Js?
  //Link: https://scientyficworld.org/how-to-use-regex-in-react-js/#:~:text=By%20using%20Regex%2C%20developers%20can,patterns%20from%20large%20text%20bodies.
  //Author: Snehasish Konger
  const validateFields = () => {
    const newErrors = {};
    if (!regexPatterns.name.test(formData.name)) newErrors.name = 'Invalid name. Only letters and spaces allowed.';
    if (!regexPatterns.amount.test(formData.amount)) newErrors.amount = 'Invalid amount. Use numeric values only.';
    if (!regexPatterns.swiftCode.test(formData.swiftCode)) newErrors.swiftCode = 'Invalid SWIFT code format.';
    if (!regexPatterns.cardNumber.test(formData.cardNumber)) newErrors.cardNumber = 'Invalid card number. Must be 16 digits.';
    if (!regexPatterns.cvv.test(formData.cvv)) newErrors.cvv = 'Invalid CVV. Must be 3 digits.';
    if (!regexPatterns.expireDate.test(formData.expireDate)) newErrors.expireDate = 'Invalid expiration date. Format: MM/YY.';
    return newErrors;
  };


  // Currency conversion
  //Reference: exchangerate-API
  //Article Name: The Accurate & Reliable Exchange Rate API
  //Link: https://www.exchangerate-api.com/
  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      return amount * rate;
    } catch (error) {
      console.error('Error converting currency', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Convert the amount to ZAR if needed
      let finalAmount = formData.amount;
      if (formData.currency !== 'ZAR') {
        finalAmount = await convertCurrency(formData.amount, formData.currency, 'ZAR');
        setConvertedAmount(finalAmount);
      }

      const transactionData = { ...formData, amount: finalAmount };

      await axios.post('http://localhost:5000/api/transactions', transactionData);
      alert('Transaction complete');
      navigate('/');
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="form_container payment_form">
        <form onSubmit={handleSubmit}>
            <h2>
                Enter Payment Information
            </h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        {errors.amount && <p style={{ color: 'red' }}>{errors.amount}</p>}
      </div>
      <div>
        <label>Currency:</label>
        <select name="currency" value={formData.currency} onChange={handleChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>SWIFT Code:</label>
        <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleChange} required />
        {errors.swiftCode && <p style={{ color: 'red' }}>{errors.swiftCode}</p>}
      </div>
      <div>
        <label>Credit Card Number:</label>
        <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required />
        {errors.cardNumber && <p style={{ color: 'red' }}>{errors.cardNumber}</p>}
      </div>
      <div>
        <label>CVV:</label>
        <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} required />
        {errors.cvv && <p style={{ color: 'red' }}>{errors.cvv}</p>}
      </div>
      <div>
        <label>Expiration Date (MM/YY):</label>
        <input type="text" name="expireDate" value={formData.expireDate} onChange={handleChange} required />
        {errors.expireDate && <p style={{ color: 'red' }}>{errors.expireDate}</p>}
      </div>
      {convertedAmount && (
        <div>
          <p>Converted Amount in ZAR: {convertedAmount.toFixed(2)}</p>
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
    
    </div>
  );
};

export default ClientPayment;
