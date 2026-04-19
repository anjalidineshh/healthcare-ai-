## 🏥 Healthcare AI Chatbot - Complete Setup Guide

### 📋 Project Overview

A full-stack healthcare chatbot application with:
- **Floating AI Avatar** at bottom-right corner with expressions and voice
- **Real-time AI Chat** using OpenAI GPT-4
- **Medicine Reminders** with adherence tracking
- **Symptom Checker** for conversational diagnosis support
- **Health Profile** management
- **Appointment Booking** system
- **Voice Input/Output** with multilingual support
- **Emergency Mode** for urgent situations

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local or Atlas)
- **OpenAI API Key** (GPT-4)
- **npm** or **yarn**

---

## 📦 Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env` from the template:

```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/healthcare-chatbot

# Server
PORT=5000
NODE_ENV=development
HOST=localhost

# OpenAI API
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# Socket.io
SOCKET_CORS=http://localhost:3000

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App
MAX_UPLOAD_SIZE=10mb
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Start MongoDB

**If using local MongoDB:**

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (from MongoDB installation folder)
mongod.exe
```

**Or use MongoDB Atlas:**
- Update `MONGODB_URI` with your Atlas connection string

### 4. Run Backend

```bash
# Development with hot-reload
npm run dev

# Production
npm start
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on port 5000
📍 Environment: development
🔗 Socket.io available at ws://localhost:5000
📅 Medicine reminder cron job scheduled
```

---

## 💻 Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `frontend/.env.local`:

```bash
cp .env.example .env.local
```

**Edit `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_APP_NAME=HealthCare AI Chatbot
```

### 3. Run Frontend

```bash
npm run dev
```

Access at: **http://localhost:3000**

---

## 🏗️ Project Structure

```
healthcare-ai-chatbot/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Main server file
│   │   ├── models/
│   │   │   └── index.js             # MongoDB schemas
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication
│   │   │   ├── chat.js              # Chat & AI
│   │   │   ├── medicine.js          # Medicine reminders
│   │   │   ├── health.js            # Health metrics
│   │   │   ├── appointments.js      # Appointments
│   │   │   └── notifications.js     # Notifications
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verification
│   │   └── services/
│   │       └── aiService.js         # OpenAI integration
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── pages/
│   │   ├── api/
│   │   │   └── chat.js              # Frontend API routes
│   │   ├── index.js                 # Home page
│   │   ├── dashboard.js             # Main dashboard
│   │   ├── medicines.js             # Medicine management
│   │   ├── appointments.js          # Appointments
│   │   └── health-metrics.js        # Health tracking
│   ├── components/
│   │   ├── FloatingAvatar/
│   │   │   ├── FloatingAvatar.jsx   # Main avatar component
│   │   │   ├── AvatarFace.jsx       # 3D face animation
│   │   │   └── ChatPanel.jsx        # Chat messages
│   │   ├── Layout.jsx               # Page layout
│   │   └── Navigation.jsx           # Top navigation
│   ├── hooks/
│   │   ├── useVoiceRecognition.js   # Speech-to-text
│   │   └── useSpeechSynthesis.js    # Text-to-speech
│   ├── store/
│   │   └── avatarStore.js           # Zustand state
│   ├── pages/_app.js                # Next.js app wrapper
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
```

---

## 🧠 Core Features Implementation

### 1. Floating Avatar

**Location:** `frontend/components/FloatingAvatar/FloatingAvatar.jsx`

Features:
- Fixed bottom-right corner positioning
- Draggable when collapsed
- Expands into chat panel on click
- Auto-greeting on first load
- Voice input via microphone
- Real-time expression changes

**Usage:**

```jsx
// In your main layout
import FloatingAvatar from '@/components/FloatingAvatar/FloatingAvatar';

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <FloatingAvatar />
    </div>
  );
}
```

### 2. Avatar Expressions

**Supported expressions:**
- `happy` - Smiling, friendly
- `concerned` - Worried, serious
- `thinking` - Processing, analyzing
- `neutral` - Default state
- `speaking` - Mouth animation during TTS

### 3. AI Chat System

**Flow:**
1. User sends message via text or voice
2. Frontend sends to `/api/chat/send`
3. Backend calls OpenAI with conversation history
4. AI response includes emotion detection
5. Response displayed with avatar expression
6. Text-to-speech converts response to voice

**Example:**

```javascript
// POST /api/chat/send
{
  "message": "I have a headache",
  "conversationId": "conv_123",
  "context": { "messages": [...] }
}

// Response:
{
  "success": true,
  "message": "I'm sorry to hear that. Can you describe the headache? Is it sharp, dull, or throbbing?",
  "emotion": "concerned",
  "conversationId": "conv_123"
}
```

### 4. Medicine Reminder System

**Add Medicine:**

```bash
POST /api/medicine/add
{
  "medicineName": "Aspirin",
  "dosage": "500mg",
  "frequency": "twice",
  "reminderTimes": ["08:00", "20:00"],
  "startDate": "2024-01-15",
  "reason": "Headache relief"
}
```

**Cron Job:**
- Runs every 5 minutes
- Checks for scheduled medicine times
- Creates notifications
- Avatar reminds user with voice message

**Log Adherence:**

```bash
POST /api/medicine/log-adherence
{
  "reminderId": "med_123",
  "time": "08:15",
  "notes": "Took with breakfast"
}
```

### 5. Symptom Checker

**Usage:**

```bash
POST /api/chat/symptom-check
{
  "symptoms": ["headache", "fever", "cough"],
  "conversationId": "sym_123"
}

// Response:
{
  "success": true,
  "message": "I see you have a headache, fever, and cough. Can you tell me...",
  "severity": "moderate",
  "shouldSeekDoctor": true,
  "isEmergency": false
}
```

### 6. Voice Integration

**Speech-to-Text:**

```javascript
import useVoiceRecognition from '@/hooks/useVoiceRecognition';

const { isListening, transcript, startListening, stopListening } = 
  useVoiceRecognition();

// Supported languages:
// en-IN (English - India)
// hi-IN (Hindi)
// ml-IN (Malayalam)
```

**Text-to-Speech:**

```javascript
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

const { speak, isSpeaking, stop } = useSpeechSynthesis();

// Speak with language
speak("Hello, how can I help you?", "en-IN");
```

---

## 🔐 Authentication Flow

### 1. Register

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Returns JWT token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### 3. Use Token

All subsequent requests include token in header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📊 Database Schema

### User Collection

```javascript
{
  _id: "user@example.com",
  email: "user@example.com",
  password: "hashed_password",
  firstName: "John",
  lastName: "Doe",
  healthProfile: {
    age: 30,
    gender: "male",
    bloodType: "O+",
    allergies: ["Penicillin"],
    medicalConditions: ["Hypertension"],
    currentMedications: ["Lisinopril"],
    emergencyContact: {
      name: "Jane Doe",
      phone: "+91 98765 43210",
      relation: "Spouse"
    }
  },
  language: "en",
  voiceEnabled: true,
  createdAt: "2024-01-15T10:00:00Z"
}
```

### Chat Messages

```javascript
{
  userId: "user@example.com",
  conversationId: "conv_123",
  role: "assistant",
  content: "How can I help you?",
  messageType: "text",
  emotion: "happy",
  createdAt: "2024-01-15T10:05:00Z"
}
```

### Medicine Reminders

```javascript
{
  userId: "user@example.com",
  medicineName: "Aspirin",
  dosage: "500mg",
  frequency: "twice",
  reminderTimes: ["08:00", "20:00"],
  startDate: "2024-01-15",
  endDate: "2024-02-15",
  adherence: [
    {
      date: "2024-01-15",
      taken: true,
      time: "08:15",
      notes: "With breakfast"
    }
  ],
  isActive: true,
  createdAt: "2024-01-15T10:00:00Z"
}
```

---

## 🧪 Testing the Application

### 1. Test Avatar

1. Open http://localhost:3000
2. Click the avatar bubble at bottom-right
3. Avatar should expand with greeting message
4. Avatar face should be animated
5. Click microphone and say something
6. Type and press Send
7. Avatar should respond with expression changes

### 2. Test Medicine Reminders

```bash
# Add medicine
curl -X POST http://localhost:5000/api/medicine/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Vitamin D",
    "dosage": "1000 IU",
    "frequency": "once",
    "reminderTimes": ["09:00"],
    "startDate": "2024-01-15"
  }'

# Get medicines
curl http://localhost:5000/api/medicine/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Test AI Chat

```bash
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache",
    "conversationId": "conv_123"
  }'
```

### 4. Test Voice Recognition

- Click microphone in avatar
- Say "I have a fever"
- Transcript should appear
- Message sent automatically

---

## 🌍 Multilingual Support

The application supports multiple languages:

### Frontend Language Selection

```javascript
// In user settings
POST /api/auth/profile
{
  "language": "hi-IN"  // Hindi
  // or "ml-IN" for Malayalam
  // or "en-IN" for English
}
```

### Voice Synthesis Languages

```javascript
speak(message, "en-IN"); // English
speak(message, "hi-IN");  // Hindi
speak(message, "ml-IN");  // Malayalam
```

---

## 🚨 Emergency Mode

When users indicate severe symptoms:

1. Avatar expression changes to "concerned"
2. Response tone becomes urgent
3. Strong recommendation to contact emergency services
4. Option to send SOS to emergency contacts

**Emergency Keywords:**
- Severe chest pain
- Difficulty breathing
- Loss of consciousness
- Severe bleeding
- Poisoning

---

## 📱 Mobile Responsiveness

The avatar automatically adapts:
- Smaller avatar on mobile
- Chat panel takes full screen below avatar
- Touch-friendly buttons and inputs
- Optimized for portrait and landscape

---

## 🔒 Security Best Practices

1. **JWT Authentication**
   - Tokens expire in 7 days
   - Stored in browser memory (not localStorage to prevent XSS)
   - Verified on every API request

2. **Password Security**
   - Bcrypt hashing with salt
   - Minimum complexity enforced
   - Password never logged

3. **API Security**
   - CORS enabled only for trusted origins
   - Input validation on all endpoints
   - Rate limiting recommended for production

4. **Data Privacy**
   - Health data encrypted in transit (HTTPS)
   - User data isolated by userId
   - No data shared with third parties

---

## 🚀 Deployment

### Backend (Heroku)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
```

---

## ⚠️ Important Disclaimers

**Add to your application:**

```jsx
<div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
  <p className="text-sm font-semibold text-yellow-800">
    ⚠️ Medical Disclaimer
  </p>
  <p className="text-sm text-yellow-700 mt-2">
    This AI health assistant does not replace professional medical advice. 
    Always consult with qualified healthcare professionals for diagnosis, 
    treatment, or medical advice. In case of emergency, call your local 
    emergency number or visit the nearest hospital.
  </p>
</div>
```

---

## 🐛 Troubleshooting

### Avatar Not Showing

- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Clear browser cache (Ctrl+F5)

### Voice Not Working

- Check microphone permissions
- Supported browsers: Chrome, Edge, Safari 15+
- For Safari: Enable "Allow Microphone" in Settings

### Messages Not Sending

- Verify JWT token is valid
- Check network tab in DevTools
- Ensure backend is running on correct port

### MongoDB Connection Failed

- Verify connection string in `.env`
- Check MongoDB service is running
- For Atlas: Whitelist your IP address

### OpenAI API Error

- Verify API key is valid
- Check API key has sufficient credits
- Verify model name is correct (gpt-4-turbo-preview)

---

## 📚 Additional Resources

- **OpenAI API Docs:** https://platform.openai.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Express.js Docs:** https://expressjs.com
- **MongoDB Docs:** https://docs.mongodb.com
- **Socket.io Docs:** https://socket.io/docs
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review server logs
3. Check browser console
4. Verify all environment variables
5. Test with Postman/curl first

---

## 📄 License

This project is provided as-is for educational purposes.

---

**Last Updated:** January 2024
**Version:** 1.0.0
