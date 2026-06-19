const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Configure where uploaded images are stored
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

// GET LOGGED-IN USER'S PROFILE
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE PROFILE INFO (first name, last name)
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPLOAD PROFILE IMAGE
router.post('/profile/upload', protect, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile image uploaded successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;