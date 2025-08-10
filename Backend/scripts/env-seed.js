require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

const seedFromEnv = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@blogify.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Admin User',
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        bio: 'System Administrator'
      });
      
      await adminUser.save();
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedFromEnv();
