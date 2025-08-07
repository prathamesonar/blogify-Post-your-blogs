const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/connectDB');
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount the user routes
app.use('/api/users', userRoutes); // Add this line

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
