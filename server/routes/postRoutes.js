const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

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