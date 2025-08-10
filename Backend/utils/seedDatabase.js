const mongoose = require('mongoose');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const seedUsers = [
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@blogify.com',
    password: 'admin123',
    role: 'admin',
    bio: 'System Administrator'
  },
  {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123',
    role: 'user',
    bio: 'Regular test user'
  },
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Just a regular user'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/social-media-app');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email} with password: ${userData.password}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
