const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs-news-portal');
    console.log('✅ MongoDB connected successfully');
    
    const News = require('../models/News');
    const newsCount = await News.countDocuments();
    console.log(`✅ Found ${newsCount} news articles in database`);
    
    // Test a sample query
    const sampleNews = await News.findOne().sort({ createdAt: -1 });
    if (sampleNews) {
      console.log('✅ Sample news article:', sampleNews.title);
    } else {
      console.log('❌ No news articles found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testConnection();