/**
 * Notifications Routes
 * Location: backend/src/routes/notifications.js
 */

const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/notifications
 * Get all notifications for user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadOnly = req.query.unread === 'true';

    const query = { userId };
    if (unreadOnly) query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      totalCount: notifications.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany({ userId }, { read: true });

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Notification.findOneAndDelete({ _id: id, userId });

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
