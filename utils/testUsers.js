const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs-news-portal');
    console.log('✅ Connected to MongoDB');

    const users = await User.find();
    console.log(`📊 Found ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    // Test login with admin credentials
    const adminUser = await User.findOne({ email: 'admin@dsvv.ac.in' });
    if (adminUser) {
      console.log('\n🔐 Testing admin login...');
      const isPasswordValid = await adminUser.comparePassword('admin123');
      console.log(`   Password match: ${isPasswordValid}`);
    } else {
      console.log('❌ Admin user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testUsers();