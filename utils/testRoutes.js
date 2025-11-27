const express = require('express');
const app = express();

// Test route loading
console.log('🔄 Testing route imports...');

try {
  const newsRoutes = require('../routes/news');
  console.log('✅ News routes loaded successfully');
} catch (error) {
  console.log('❌ News routes failed:', error.message);
}

try {
  const authRoutes = require('../routes/auth');
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.log('❌ Auth routes failed:', error.message);
}

try {
  const uploadRoutes = require('../routes/upload');
  console.log('✅ Upload routes loaded successfully');
} catch (error) {
  console.log('❌ Upload routes failed:', error.message);
}

console.log('🏁 Route testing completed');
process.exit(0);