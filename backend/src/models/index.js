/**
 * Database Schemas for Healthcare Chatbot
 * Location: backend/src/models/index.js
 */

const mongoose = require('mongoose');

// ============ USER SCHEMA ============
const userSchema = new mongoose.Schema({
  _id: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  avatar: String,
  
  // Health Profile
  healthProfile: {
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodType: String,
    height: Number,
    weight: Number,
    allergies: [String],
    medicalConditions: [String],
    currentMedications: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  
  // Settings
  language: { type: String, default: 'en' },
  voiceEnabled: { type: Boolean, default: true },
  avatarMode: { type: String, enum: ['normal', 'emergency'], default: 'normal' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'users' });

// ============ CHAT MESSAGE SCHEMA ============
const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  conversationId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'voice', 'image'], default: 'text' },
  emotion: { type: String, enum: ['happy', 'sad', 'concerned', 'neutral', 'thinking'], default: 'neutral' },
  metadata: {
    voiceUrl: String,
    imageUrl: String,
    duration: Number,
  },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'chat_messages' });

// ============ MEDICINE REMINDER SCHEMA ============
const medicineReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, enum: ['once', 'twice', 'thrice', 'custom'], required: true },
  reminderTimes: [String], // HH:mm format
  startDate: Date,
  endDate: Date,
  reason: String,
  
  // Adherence tracking
  adherence: [{
    date: Date,
    taken: Boolean,
    time: String,
    notes: String,
  }],
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'medicine_reminders' });

// ============ HEALTH METRIC SCHEMA ============
const healthMetricSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  metricType: { 
    type: String, 
    enum: ['blood_pressure', 'heart_rate', 'blood_sugar', 'weight', 'temperature', 'sleep_hours'],
    required: true 
  },
  value: Number,
  unit: String,
  notes: String,
  isAbnormal: Boolean,
  recordedAt: { type: Date, default: Date.now },
}, { collection: 'health_metrics' });

// ============ APPOINTMENT SCHEMA ============
const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  doctorName: String,
  specialty: String,
  clinicName: String,
  appointmentDate: Date,
  duration: Number,
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled'], default: 'scheduled' },
  reminderSent: { type: Boolean, default: false },
  notes: String,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'appointments' });

// ============ SYMPTOM CHECKER CONVERSATION SCHEMA ============
const symptomCheckerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  conversationId: { type: String, required: true },
  symptoms: [String],
  duration: String,
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
  recommendations: [String],
  shouldSeekDoctor: Boolean,
  messages: [{
    role: String,
    content: String,
    timestamp: Date,
  }],
  createdAt: { type: Date, default: Date.now },
}, { collection: 'symptom_checker' });

// ============ NOTIFICATION SCHEMA ============
const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['medicine', 'appointment', 'refill', 'emergency', 'alert'], required: true },
  title: String,
  message: String,
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  read: { type: Boolean, default: false },
  relatedId: String, // Reference to medicine/appointment/etc
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
}, { collection: 'notifications' });

// ============ EMERGENCY ALERT SCHEMA ============
const emergencyAlertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['sos', 'severe_symptom', 'critical_reading'], required: true },
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  emergencyContacts: [String],
  status: { type: String, enum: ['active', 'handled', 'resolved'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'emergency_alerts' });

// ============ PRESCRIPTION SCHEMA ============
const prescriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prescriptionImage: String,
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
  }],
  doctorName: String,
  clinicName: String,
  date: Date,
  expiryDate: Date,
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'prescriptions' });

// Export all models
module.exports = {
  User: mongoose.model('User', userSchema),
  ChatMessage: mongoose.model('ChatMessage', chatMessageSchema),
  MedicineReminder: mongoose.model('MedicineReminder', medicineReminderSchema),
  HealthMetric: mongoose.model('HealthMetric', healthMetricSchema),
  Appointment: mongoose.model('Appointment', appointmentSchema),
  SymptomChecker: mongoose.model('SymptomChecker', symptomCheckerSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  EmergencyAlert: mongoose.model('EmergencyAlert', emergencyAlertSchema),
  Prescription: mongoose.model('Prescription', prescriptionSchema),
};
