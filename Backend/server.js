const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/connectDB');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // Import post routes

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); // Mount post routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
