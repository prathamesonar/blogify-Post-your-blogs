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


//////////////////
app.use(cors({
  origin: process.env.CORS_ORIGIN, // This will be your frontend's URL
  credentials: true,
}));
////////////////
// // CORS configuration
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000', 'https://blogify-post-your-blogs.onrender.com'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
