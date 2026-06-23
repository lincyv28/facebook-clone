const express = require('express');
const Notification = require('../models/Notification');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// GET LOGGED-IN USER'S NOTIFICATIONS
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('sender', 'firstName lastName profileImage')
      .populate('post', 'text');

    const unreadCount = await Notification.countDocuments({ recipient: req.userId, isRead: false });

    res.status(200).json({ notifications, unreadCount });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MARK ALL NOTIFICATIONS AS READ
router.put('/mark-read', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: 'Notifications marked as read' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;