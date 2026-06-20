const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
// GET ALL POSTS (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName profileImage');

    const totalPosts = await Post.countDocuments();
    const hasMore = skip + posts.length < totalPosts;

    res.status(200).json({ posts, hasMore });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Configure where uploaded post images are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// CREATE POST API
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;

    // At least text or image must be provided
    if (!text && !req.file) {
      return res.status(400).json({ message: 'Post must have text or an image' });
    }

    const newPost = new Post({
      user: req.userId,
      text: text || '',
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await newPost.save();

    // Populate user info before sending back
    const populatedPost = await Post.findById(newPost._id).populate('user', 'firstName lastName profileImage');

    res.status(201).json({ message: 'Post created successfully', post: populatedPost });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;