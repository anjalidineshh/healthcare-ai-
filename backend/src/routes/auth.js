/**
 * Authentication Routes
 * Location: backend/src/routes/auth.js
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken, verifyToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      _id: email,
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      healthProfile: {},
      language: 'en',
      voiceEnabled: true,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        healthProfile: user.healthProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/profile
 * Get user profile
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PATCH /api/auth/profile
 * Update user profile
 */
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, healthProfile, language, voiceEnabled } =
      req.body;
    const userId = req.user.id;

    const updateData = {};
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (language) updateData.language = language;
    if (voiceEnabled !== undefined) updateData.voiceEnabled = voiceEnabled;
    if (healthProfile) {
      updateData.healthProfile = {
        ...(existingUser.healthProfile || {}),
        ...healthProfile,
      };
    }

    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password');

    res.json({
      success: true,
      message: 'Profile updated',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/update-health-profile
 * Update health profile
 */
router.post('/update-health-profile', verifyToken, async (req, res) => {
  try {
    const {
      age,
      gender,
      bloodType,
      height,
      weight,
      allergies,
      medicalConditions,
      currentMedications,
      emergencyContact,
    } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.healthProfile = {
      age: age || user.healthProfile.age,
      gender: gender || user.healthProfile.gender,
      bloodType: bloodType || user.healthProfile.bloodType,
      height: height || user.healthProfile.height,
      weight: weight || user.healthProfile.weight,
      allergies: allergies || user.healthProfile.allergies,
      medicalConditions:
        medicalConditions || user.healthProfile.medicalConditions,
      currentMedications:
        currentMedications || user.healthProfile.currentMedications,
      emergencyContact: emergencyContact || user.healthProfile.emergencyContact,
    };

    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Health profile updated',
      healthProfile: user.healthProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
