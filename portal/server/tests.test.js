const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');

// MongoDB connection URI
const uri = 'mongodb+srv://Daud1024:QxHlisLkh0UXc10g@usercluster.vfu00.mongodb.net/?retryWrites=true&w=majority&appName=UserCluster';

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet.frameguard({ action: 'deny' }));

// Load SSL certificate
const privateKey = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// MongoDB connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

// Employee schema and model for 'employees' collection
const employeeSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const Employee = mongoose.model('Employee', employeeSchema);

// User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

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

// Registration and login routes for employees
app.post('/api/emp/register', async (req, res) => {
  const { email, password } = req.body;
  const existingEmployee = await Employee.findOne({ email });

  if (existingEmployee) {
    return res.status(400).send('Employee already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newEmployee = new Employee({ email, password: hashedPassword });

  try {
    await newEmployee.save();
    res.status(201).send('Employee registered successfully');
  } catch (error) {
    res.status(500).send('Error registering employee');
  }
});

app.post('/api/emp/login', async (req, res) => {
  const { email, password } = req.body;
  const employee = await Employee.findOne({ email });

  if (!employee) {
    return res.status(401).send('Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, employee.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid email or password.');
  }

  res.status(200).send('Login successful');
});

// Registration and login routes for users
app.post('/api/cust/register', async (req, res) => {
  const { email, accountNumber, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, accountNumber, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/api/cust/login', async (req, res) => {
  const { email, accountNumber, password } = req.body;
  const user = await User.findOne({ email, accountNumber });

  if (!user) {
    return res.status(401).send('Invalid email, account number, or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid email, account number, or password.');
  }

  res.status(200).send('Login successful');
});

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

// Start the server using HTTPS
const httpsServer = https.createServer(credentials, app);
const PORT = process.env.PORT || 8080;

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

// Tests
describe('API Tests', () => {
  beforeEach(async () => {
    // Ensure the necessary users exist for positive tests
    await User.deleteMany({}); // Clear the existing users before each test

    // Creating a test user
    const hashedPassword = await bcrypt.hash('Daud1Cassim', 10);
    await User.create({
      email: 'daud24cassim@gmail.com',
      accountNumber: '1234',
      password: hashedPassword,
    });
  });

  afterAll(async () => {
    // Disconnect from MongoDB after all tests
    await mongoose.disconnect();
  
    await new Promise((resolve) => {
      httpsServer.close(() => {
        console.log('Server closed');
        resolve();
      });
    });
  });
  

  // Customer Registration Test
  it('should register a new customer', async () => {
    const response = await request(app)
      .post('/api/cust/register')
      .send({
        email: 'newuser@example.com',
        accountNumber: '9876543210',
        password: 'NewUserPassword',
      });

    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('User registered successfully');
  });

  // Customer Login Test
  it('should login an existing customer', async () => {
    const response = await request(app)
      .post('/api/cust/login')
      .send({
        email: 'daud24cassim@gmail.com',
        accountNumber: '1234',
        password: 'Daud1Cassim',
      });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Login successful');
  });

  // Customer Login Test with invalid credentials
  it('should return error for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/cust/login')
      .send({
        email: 'invaliduserexample.com',
        accountNumber: '123456789',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Invalid email, account number, or password.');
  });
});

