const { cloudinary } = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image: ' + error.message });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    res.json({
      images: uploadedImages,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading images: ' + error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;
    
    await cloudinary.uploader.destroy(public_id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting image: ' + error.message });
  }
};