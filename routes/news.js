const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { auth } = require('../middleware/auth');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'News API is working!' });
});

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:slug', newsController.getNewsBySlug);
router.get('/category/:category', newsController.getNewsByCategory);
router.get('/club/:clubName', newsController.getNewsByClub);

// Protected routes
router.post('/', auth, newsController.createNews);
router.put('/:id', auth, newsController.updateNews);
router.delete('/:id', auth, newsController.deleteNews);

module.exports = router;