/**
 * Appointments Routes
 * Location: backend/src/routes/appointments.js
 */

const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { Appointment, Notification } = require('../models');
const { verifyToken } = require('../middleware/auth');

/**
 * POST /api/appointments/book
 * Book an appointment
 */
router.post('/book', verifyToken, async (req, res) => {
  try {
    const {
      doctorName,
      specialty,
      clinicName,
      appointmentDate,
      duration,
      notes,
    } = req.body;
    const userId = req.user.id;

    if (!doctorName || !appointmentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appointment = new Appointment({
      userId,
      doctorName,
      specialty,
      clinicName,
      appointmentDate: new Date(appointmentDate),
      duration: duration || 30,
      status: 'scheduled',
      notes,
    });

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/appointments/list
 * Get all appointments
 */
router.get('/list', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const status = req.query.status;

    const query = { userId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query).sort({
      appointmentDate: 1,
    });

    res.json({
      success: true,
      appointments,
      count: appointments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/appointments/:id/confirm
 * Confirm appointment
 */
router.post('/:id/confirm', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, userId },
      { status: 'confirmed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment confirmed',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * CRON JOB - Send appointment reminders 24 hours before
 */
const sendAppointmentReminders = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: tomorrow, $lte: endOfTomorrow },
      reminderSent: false,
    });

    for (const appointment of appointments) {
      await Notification.create({
        userId: appointment.userId,
        type: 'appointment',
        title: 'Appointment Reminder',
        message: `Your appointment with Dr. ${appointment.doctorName} is tomorrow at ${new Date(
          appointment.appointmentDate
        ).toLocaleTimeString()}`,
        priority: 'normal',
        relatedId: appointment._id,
      });

      appointment.reminderSent = true;
      await appointment.save();

      console.log(`📅 Appointment reminder sent for ${appointment.doctorName}`);
    }
  } catch (error) {
    console.error('Appointment reminder cron error:', error);
  }
};

// Schedule to run daily at 9 AM
cron.schedule('0 9 * * *', sendAppointmentReminders);

module.exports = router;
