const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

// SEARCH USERS AND POSTS
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim() === '') {
      return res.status(200).json({ users: [], posts: [] });
    }

    // Search users by first name or last name (case-insensitive)
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    }).select('firstName lastName profileImage').limit(5);

    // Search posts by text content (case-insensitive)
    const posts = await Post.find({
      text: { $regex: query, $options: 'i' }
    })
      .populate('user', 'firstName lastName profileImage')
      .limit(5);

    res.status(200).json({ users, posts });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;