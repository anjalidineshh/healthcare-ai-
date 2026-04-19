/**
 * Health Metrics Routes
 * Location: backend/src/routes/health.js
 */

const express = require('express');
const router = express.Router();
const { HealthMetric } = require('../models');
const { verifyToken } = require('../middleware/auth');

const isAbnormalReading = (type, value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return false;

  const normalRanges = {
    heart_rate: [60, 100],
    blood_sugar: [70, 140],
    temperature: [36.0, 37.8],
    weight: [25, 300],
    sleep_hours: [5, 10],
  };

  if (!normalRanges[type]) return false;
  const [min, max] = normalRanges[type];
  return numericValue < min || numericValue > max;
};

/**
 * POST /api/health/metric
 * Record a health metric
 */
router.post('/metric', verifyToken, async (req, res) => {
  try {
    const { metricType, value, unit, notes } = req.body;
    const userId = req.user.id;

    const metric = new HealthMetric({
      userId,
      metricType,
      value,
      unit,
      notes,
      isAbnormal: isAbnormalReading(metricType, value),
      recordedAt: new Date(),
    });

    await metric.save();

    res.json({
      success: true,
      message: 'Health metric recorded',
      metric,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/health/metrics/:type
 * Get metrics by type
 */
router.get('/metrics/:type', verifyToken, async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;
    const days = req.query.days || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await HealthMetric.find({
      userId,
      metricType: type,
      recordedAt: { $gte: startDate },
    }).sort({ recordedAt: 1 });

    res.json({
      success: true,
      type,
      metrics,
      count: metrics.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
