const mongoose = require('mongoose');
const News = require('../models/News');
const User = require('../models/User');
require('dotenv').config();

const sampleNews = [
  {
    title: "Welcome to CS Department",
    content: "Welcome to the Computer Science Department of DSVV University...",
    excerpt: "Welcome message for new students",
    category: "cs",
    author: "CS Department",
    isPublished: true,
    publishedAt: new Date(),
    tags: ["welcome", "department"]
  },
  {
    title: "Alumni Success Story: John Doe",
    content: "John Doe, our 2018 graduate, is now working at Google...",
    excerpt: "Success story of our alumni John Doe",
    category: "alumni", 
    author: "CS Department",
    isPublished: true,
    publishedAt: new Date(),
    tags: ["alumni", "success"]
  },
  {
    title: "Coding Club Workshop Announcement",
    content: "Coding club is organizing a Python workshop...",
    excerpt: "Python workshop by coding club",
    category: "club",
    clubName: "coding-club",
    author: "Coding Club",
    isPublished: true, 
    publishedAt: new Date(),
    tags: ["workshop", "python", "coding"]
  },
  {
    title: "Upcoming AI Conference - Draft",
    content: "AI Club is planning a conference...",
    excerpt: "Draft for AI conference",
    category: "club", 
    clubName: "ai-ml-club",
    author: "AI Club",
    isPublished: false, // This is a draft
    tags: ["conference", "ai"]
  }
];

const adminUser = {
  username: "admin",
  email: "admin@dsvv.ac.in", 
  password: "admin123",
  role: "admin"
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await News.deleteMany({});
    await User.deleteMany({});

    // Insert sample news
    await News.insertMany(sampleNews);
    console.log('Sample news inserted');

    // Create admin user
    const user = new User(adminUser);
    await user.save();
    console.log('Admin user created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();