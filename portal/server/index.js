// server.js 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');




// Initialize express
const app = express();
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://Daud1024:QxHlisLkh0UXc10g@usercluster.vfu00.mongodb.net/?retryWrites=true&w=majority&appName=UserCluster"

// Clicking Jack measures
//Reference: LogRocket
//Article Name: Using Helmet in Node.js to secure your application
//Link: https://blog.logrocket.com/using-helmet-node-js-secure-application/
//Author: Antonello Zanini

app.use(helmet.frameguard({ action: 'deny' }));

// Load SSL certificate
const privateKey = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.cert', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Start the server using HTTPS
//Reference: TutorialsPoint
//Article Name: How to create HTTPS Server with Node.js?
//Link: https://www.tutorialspoint.com/how-to-create-https-server-with-node-js#:~:text=Once%20you%20obtain%20the%20certificate,creating%20the%20HTTPS%20server%20instance.
//Author: Aayush Mohan Sinha
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});


// MongoDB connection
//Reference: Medium
//Article Name: Step-by-Step Guide: Connecting MongoDB with React.js for Seamless Full Stack Development
//Link: https://medium.com/@kaklotarrahul79/step-by-step-guide-connecting-mongodb-with-react-js-for-seamless-full-stack-development-db51c34da282
//Author: Rahul Kaklotar
mongoose.connect(uri).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));


// Transaction schema and model
const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  currency: String,
  swiftCode: String,
  cardNumber: String,
  cvv: String,
  expireDate: String,
  date: { type: Date, default: Date.now },
});

// Explicitly bind the schema to the 'transactions' collection
const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

// POST route to handle transactions
app.post('/api/transactions', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).send('Transaction recorded');
  } catch (error) {
    res.status(500).send('Error saving transaction');
  }
});

// GET route to fetch all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
});

// Employee schema and model for 'employees' collection
const employeeSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Registration route to create a new employee
app.post('/api/emp/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if the employee already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.status(400).send('Employee already exists.');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newEmployee = new Employee({ email, password: hashedPassword });
  
  try {
    await newEmployee.save();
    res.status(201).send('Employee registered successfully');
  } catch (error) {
    res.status(500).send('Error registering employee');
  }
});

// Login route
app.post('/api/emp/login', async (req, res) => {
  const { email, password } = req.body;

  // Find employee by email
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return res.status(401).send('Invalid email or password.');
  }

  // Compare the hashed password with the provided password
  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid email or password.');
  }

  res.status(200).send('Login successful');
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Registration route to create a new user
app.post('/api/cust/register', async (req, res) => {
  const { email, accountNumber, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User already exists.');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = new User({ email, accountNumber, password: hashedPassword });
  
  try {
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/api/cust/login', async (req, res) => {
  const { email, accountNumber, password } = req.body;

  // Find user by email and account number
  const user = await User.findOne({ email, accountNumber });
  if (!user) {
    return res.status(401).send('Invalid email, account number, or password.');
  }

  // Compare the hashed password with the provided password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid email, account number, or password.');
  }

  res.status(200).send('Login successful');
});

app.use((req, res, next) => {
  if (req.protocol === 'http') {
    res.redirect(301, 'https://${req.headers.host}${req.url}');
  } else {
    next();
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});