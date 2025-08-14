// File: Backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./utils/connectDB');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();
const app = express();

// ✅ MIDDLEWARE ORDER FIX: cookieParser must come before cors
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN, // Ensure this is set correctly on Render
  credentials: true,
}));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```javascript
// File: Backend/utils/generateToken.js
// This version is correct and included for completeness.

const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    // 'secure' is essential for cross-site cookies
    secure: process.env.NODE_ENV !== 'development', 
    // 'sameSite: none' allows the cookie to be sent across domains
    sameSite: 'none', 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

module.exports = generateToken;
