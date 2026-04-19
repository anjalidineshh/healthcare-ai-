/**
 * Medicine Reminder Routes & Service
 * Location: backend/src/routes/medicine.js
 * 
 * Handles medicine reminders, adherence tracking, and notifications
 */

const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { MedicineReminder, Notification, User } = require('../models');
const { verifyToken } = require('../middleware/auth');

/**
 * POST /api/medicine/add
 * Add a new medicine reminder
 */
router.post('/add', verifyToken, async (req, res) => {
  try {
    const {
      medicineName,
      dosage,
      frequency,
      reminderTimes,
      startDate,
      endDate,
      reason,
    } = req.body;
    const userId = req.user.id;

    if (!medicineName || !dosage || !reminderTimes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reminder = new MedicineReminder({
      userId,
      medicineName,
      dosage,
      frequency,
      reminderTimes,
      startDate: startDate || new Date(),
      endDate,
      reason,
      isActive: true,
    });

    await reminder.save();

    res.json({
      success: true,
      message: 'Medicine reminder added',
      reminderData: reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/medicine/list
 * Get all active medicine reminders for user
 */
router.get('/list', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const reminders = await MedicineReminder.find({
      userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reminders,
      count: reminders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/medicine/log-adherence
 * Log that user took their medicine
 */
router.post('/log-adherence', verifyToken, async (req, res) => {
  try {
    const { reminderId, time, notes } = req.body;
    const userId = req.user.id;

    const reminder = await MedicineReminder.findOne({
      _id: reminderId,
      userId,
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    reminder.adherence.push({
      date: new Date(),
      taken: true,
      time,
      notes,
    });

    await reminder.save();

    res.json({
      success: true,
      message: 'Medicine adherence logged',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/medicine/adherence/:reminderId
 * Get adherence data for a medicine
 */
router.get('/adherence/:reminderId', verifyToken, async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await MedicineReminder.findOne({
      _id: reminderId,
      userId,
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    const totalDays = reminder.adherence.length;
    const takenDays = reminder.adherence.filter((a) => a.taken).length;
    const adherenceRate =
      totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0;

    res.json({
      success: true,
      medicine: reminder.medicineName,
      adherenceRate,
      takenDays,
      totalDays,
      adherence: reminder.adherence.slice(-30), // Last 30 days
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/medicine/:reminderId
 * Deactivate or delete medicine reminder
 */
router.delete('/:reminderId', verifyToken, async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.id;

    await MedicineReminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Medicine reminder deactivated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * CRON JOB - Check for medicine reminders every 5 minutes
 * Sends notifications to users for scheduled medicines
 */
const checkMedicineReminders = async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Find all active reminders for current time
    const reminders = await MedicineReminder.find({
      isActive: true,
      reminderTimes: currentTime,
    }).populate('userId');

    for (const reminder of reminders) {
      // Check if already taken today
      const alreadyTaken = reminder.adherence.some((a) => {
        const adherenceDate = new Date(a.date).toDateString();
        return adherenceDate === new Date().toDateString() && a.taken;
      });

      if (!alreadyTaken) {
        // Create notification
        await Notification.create({
          userId: reminder.userId,
          type: 'medicine',
          title: `Time to take ${reminder.medicineName}`,
          message: `Take ${reminder.dosage} of ${reminder.medicineName}`,
          priority: 'high',
          relatedId: reminder._id,
        });

        console.log(`💊 Medicine reminder notification sent for ${reminder.medicineName}`);
      }
    }
  } catch (error) {
    console.error('Medicine reminder cron error:', error);
  }
};

// Schedule cron job to run every 5 minutes
cron.schedule(
  process.env.MEDICINE_REMINDER_CHECK_INTERVAL || '*/5 * * * *',
  checkMedicineReminders
);

console.log('📅 Medicine reminder cron job scheduled');

module.exports = router;
