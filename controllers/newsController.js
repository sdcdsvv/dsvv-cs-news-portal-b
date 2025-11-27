const News = require("../models/News");
const { validationResult } = require("express-validator");

// Get all news with pagination and filters
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, club, search } = req.query;

    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (club) filter.clubName = club;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const news = await News.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content"); // Don't send full content in list

    const total = await News.countDocuments(filter);

    res.json({
      news,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single news by slug
exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by category
exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({
      category,
      isPublished: true,
    })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content");

    const total = await News.countDocuments({ category, isPublished: true });

    res.json({
      news,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by club
exports.getNewsByClub = async (req, res) => {
  try {
    const { clubName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({
      clubName,
      isPublished: true,
    })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content");

    const total = await News.countDocuments({ clubName, isPublished: true });

    res.json({
      news,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create news - FIXED TAGS HANDLING
exports.createNews = async (req, res) => {
  try {
    // console.log('📝 Creating news - Request body:', JSON.stringify(req.body, null, 2));
    
    // Basic validation
    if (!req.body.title || !req.body.content || !req.body.excerpt) {
      return res.status(400).json({ 
        message: 'Title, content, and excerpt are required' 
      });
    }

    // Handle tags - FIXED: Check if it's already an array
    let tags = [];
    if (Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    } else if (typeof req.body.tags === 'string') {
      tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const newsData = {
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      excerpt: req.body.excerpt.trim(),
      category: req.body.category || 'cs',
      clubName: req.body.clubName || undefined,
      author: req.body.author || 'CS Department',
      isPublished: Boolean(req.body.isPublished),
      tags: tags, // Use the properly handled tags
      images: req.body.images || [],
      publishedAt: req.body.isPublished ? new Date() : null
    };

    // Remove empty clubName
    if (!newsData.clubName) {
      delete newsData.clubName;
    }

    // console.log('📦 Processed news data:', JSON.stringify(newsData, null, 2));

    const news = new News(newsData);
    
    // Validate before saving to get detailed errors
    await news.validate();
    
    await news.save();

    console.log('✅ News created successfully:', news._id);
    
    res.status(201).json(news);
  } catch (error) {
    console.error('❌ Error creating news:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      console.error('Validation errors:', validationErrors);
      
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    
    res.status(500).json({ 
      message: 'Error creating news article',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update news - FIXED TAGS HANDLING
exports.updateNews = async (req, res) => {
  try {
    // console.log('📝 Updating news - Request body:', JSON.stringify(req.body, null, 2));

    // Handle tags for update as well - FIXED
    let tags = [];
    if (Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    } else if (typeof req.body.tags === 'string') {
      tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const updateData = {
      ...req.body,
      tags: tags,
      updatedAt: new Date()
    };

    // Remove empty clubName
    if (!updateData.clubName) {
      delete updateData.clubName;
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    console.log('✅ News updated successfully:', news._id);
    res.json(news);
  } catch (error) {
    console.error('❌ Error updating news:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};