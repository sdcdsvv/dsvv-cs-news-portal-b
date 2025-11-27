const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');

router.post('/image', upload.single('image'), uploadController.uploadImage);
router.post('/images', upload.array('images', 10), uploadController.uploadMultipleImages);
router.delete('/image/:public_id', uploadController.deleteImage);

module.exports = router;