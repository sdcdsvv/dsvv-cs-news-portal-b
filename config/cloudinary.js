const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Validate Cloudinary configuration
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('Warning: Missing Cloudinary environment variables:', missingVars);
  console.warn('Image uploads will not work without Cloudinary configuration.');
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cs-news-portal',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 630, crop: 'limit', quality: 'auto' }
    ]
  },
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  if (missingVars.length > 0) return false;
  
  try {
    await cloudinary.api.ping();
    console.log('Cloudinary connection successful');
    return true;
  } catch (error) {
    console.warn('Cloudinary connection failed:', error.message);
    return false;
  }
};

module.exports = { 
  cloudinary, 
  storage, 
  testCloudinaryConnection 
};