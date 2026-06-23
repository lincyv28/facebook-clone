const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const protect = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

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
      .populate('user', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage');

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

// GET SINGLE POST (for View Post Details)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE POST (only owner can edit)
router.put('/:id', protect, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if logged-in user is the owner of this post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    post.text = text;
    await post.save();

    const updatedPost = await Post.findById(post._id).populate('user', 'firstName lastName profileImage');

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE POST (only owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if logged-in user is the owner of this post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LIKE / UNLIKE POST (toggle)
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      // Unlike - remove userId from likes array
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      // Like - add userId to likes array
      post.likes.push(req.userId);

      // Create a notification, but not if you're liking your own post
      if (post.user.toString() !== req.userId) {
        await Notification.create({
          recipient: post.user,
          sender: req.userId,
          type: 'like',
          post: post._id
        });
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('user', 'firstName lastName profileImage');

    res.status(200).json({ post: updatedPost });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADD COMMENT
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.userId,
      text: text
    });

    await post.save();

    // Create a notification, but not if you're commenting on your own post
    if (post.user.toString() !== req.userId) {
      await Notification.create({
        recipient: post.user,
        sender: req.userId,
        type: 'comment',
        post: post._id
      });
    }

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage');

    res.status(200).json({ post: updatedPost });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE COMMENT (only comment owner can delete)
router.delete('/:postId/comment/:commentId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find((c) => c._id.toString() === req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if logged-in user is the owner of this comment
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== req.params.commentId);

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage');

    res.status(200).json({ post: updatedPost });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;