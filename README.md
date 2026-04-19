## 🏥 Healthcare AI Chatbot with Floating Avatar

A full-stack healthcare platform with an intelligent AI chatbot, floating animated avatar assistant, medicine reminders, appointment booking, and real-time health tracking.

### ✨ Key Features

#### 🤖 **AI-Powered Avatar Assistant**
- Floating assistant positioned at bottom-right corner
- Human-like 3D SVG face with multiple expressions (happy, concerned, thinking)
- Voice input/output with multilingual support (English, Hindi, Malayalam)
- Auto-greeting on page load
- Draggable and collapsible interface
- Smooth animations and transitions
- Real-time expression changes based on conversation context

#### 💬 **Intelligent Chat System**
- Context-aware conversations using OpenAI GPT-4
- Conversation history storage
- Emotion detection in responses
- Symptom checker for medical guidance
- Real-time WebSocket integration

#### 💊 **Medicine Reminder System**
- Add/manage medicines with custom schedules
- Automated reminders via notifications
- Adherence tracking (% of medicines taken)
- Avatar voice reminders
- Database persistence

#### 🏥 **Health Features**
- Complete health profile management
- Blood pressure, heart rate, blood sugar tracking
- Weight and temperature monitoring
- Sleep tracking
- Emergency contact management
- Allergy and medical condition records

#### 📅 **Appointment Management**
- Book appointments with doctors
- Schedule reminders 24 hours before
- Appointment status tracking
- Clinic and specialty information

#### 🔔 **Smart Notifications**
- Medicine reminder notifications
- Appointment reminders
- Emergency alerts
- Refill reminders
- Notification management dashboard

#### 🌍 **Multilingual Support**
- English (en-IN)
- Hindi (hi-IN)
- Malayalam (ml-IN)
- Easy language switching

#### 🎙️ **Voice Features**
- Speech-to-text input
- Text-to-speech output
- Hands-free interaction
- Browser-based (no external API required)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Real-time:** Socket.io Client
- **Voice:** Web Speech API
- **HTTP:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Real-time:** Socket.io
- **AI:** OpenAI API (GPT-4)
- **Scheduling:** node-cron
- **Hashing:** bcryptjs

### Infrastructure
- **Containerization:** Docker (optional)
- **Hosting:** Heroku / Vercel / AWS
- **Database:** MongoDB Atlas / Local

---

## 📋 Prerequisites

- **Node.js** v18+ with npm/yarn
- **MongoDB** (local or Atlas)
- **OpenAI API Key** (GPT-4 access)
- **Modern browser** with Web Speech API support

### Browser Compatibility
- Chrome/Edge: Full support
- Safari 15+: Full support
- Firefox: Limited voice support
- Mobile browsers: Optimized

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd healthcare-ai-chatbot
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your credentials
# - MONGODB_URI
# - OPENAI_API_KEY
# - JWT_SECRET

# Start MongoDB (if local)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: mongod.exe

# Run backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Ensure NEXT_PUBLIC_API_URL=http://localhost:5000

# Run frontend
npm run dev
# App runs on http://localhost:3000
```

### 4. Test Application
1. Open http://localhost:3000
2. Register a new account
3. Look for floating avatar at bottom-right corner
4. Click avatar to expand
5. Click microphone and speak
6. Type messages and see AI responses
7. Avatar expressions should change based on conversation

---

## 📁 Project Structure

```
healthcare-ai-chatbot/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express app & Socket.io setup
│   │   ├── models/index.js           # MongoDB schemas
│   │   ├── routes/
│   │   │   ├── auth.js               # User authentication
│   │   │   ├── chat.js               # AI chat endpoints
│   │   │   ├── medicine.js           # Medicine management
│   │   │   ├── health.js             # Health metrics
│   │   │   ├── appointments.js       # Appointment booking
│   │   │   └── notifications.js      # Notification system
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT verification
│   │   └── services/
│   │       └── aiService.js          # OpenAI integration
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── pages/
│   │   ├── _app.js                   # Next.js app wrapper
│   │   ├── index.js                  # Landing page
│   │   ├── login.js                  # Login page
│   │   ├── register.js               # Registration page
│   │   ├── dashboard.js              # Main dashboard
│   │   ├── medicines.js              # Medicine tracking
│   │   ├── appointments.js           # Appointment management
│   │   ├── health-metrics.js         # Health data visualization
│   │   ├── profile.js                # User profile
│   │   └── api/
│   │       └── chat.js               # API routes (if needed)
│   │
│   ├── components/
│   │   ├── Layout.jsx                # Main layout with nav & footer
│   │   ├── FloatingAvatar/
│   │   │   ├── FloatingAvatar.jsx    # Main avatar component
│   │   │   ├── AvatarFace.jsx        # 3D SVG face animation
│   │   │   └── ChatPanel.jsx         # Chat message display
│   │   └── [other components]
│   │
│   ├── hooks/
│   │   ├── useVoiceRecognition.js    # Speech-to-text
│   │   └── useSpeechSynthesis.js     # Text-to-speech
│   │
│   ├── store/
│   │   └── avatarStore.js            # Zustand state management
│   │
│   ├── styles/
│   │   └── globals.css               # Global styles
│   │
│   ├── next.config.js                # Next.js configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── package.json
│   └── .env.example
│
└── docs/
    ├── SETUP_GUIDE.md                # Complete setup instructions
    ├── API_DOCUMENTATION.md          # API endpoints & examples
    └── AVATAR_CUSTOMIZATION.md       # Avatar styling guide
```

---

## 🎯 Core Functionality

### 1. Avatar Interaction
```javascript
// Click avatar bubble to expand
// Draggable when collapsed
// Expands into full chat panel with avatar face
// Supports text and voice input
// Shows real-time expressions (happy, concerned, thinking)
```

### 2. AI Chat Flow
```
User Input → Backend API → OpenAI GPT-4 → 
Emotion Detection → Response Generation → 
Text-to-Speech → Avatar Expression → User Display
```

### 3. Medicine Reminders
```
Every 5 minutes (cron job) →
Check scheduled medicine times →
Send notifications →
Avatar voice reminder →
Log adherence when taken →
Track adherence percentage
```

### 4. Authentication
```
Register/Login → JWT Token Generation →
Token stored in localStorage →
Sent with all API requests →
Decoded on backend for user identification
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/healthcare-chatbot

# Server
PORT=5000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Socket.io
SOCKET_CORS=http://localhost:3000

# App
MAX_UPLOAD_SIZE=10mb
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🧪 Testing

### Test Registration
```bash
1. Go to http://localhost:3000/register
2. Fill in details
3. Should redirect to dashboard on success
```

### Test Avatar Chat
```bash
1. Dashboard should show avatar at bottom-right
2. Click to expand
3. Type "I have a fever"
4. Avatar should respond with concern
5. Click mic and speak
```

### Test Medicine Reminder
```bash
1. Go to Medicines page
2. Add medicine with current time
3. Wait for cron job (every 5 minutes)
4. Check notifications
5. Avatar should remind with voice
```

### Test API
```bash
# Using curl
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I have headache"}'
```

---

## 🎨 Customization

### Avatar Expressions
Edit `frontend/components/FloatingAvatar/AvatarFace.jsx`:
- Modify SVG paths for facial features
- Change colors in gradient definitions
- Add new expression states
- Adjust animation speeds

### Avatar Position
Edit `frontend/components/FloatingAvatar/FloatingAvatar.jsx`:
- Change `fixed bottom-6 right-6` to reposition
- Adjust width/height for size
- Modify shadow for different effects

### Avatar Size
Modify size object in `AvatarFace.jsx`:
```javascript
const sizes = {
  tiny: { width: 40, height: 40, face: 24 },
  small: { width: 64, height: 64, face: 48 },
  medium: { width: 120, height: 120, face: 100 },
  large: { width: 200, height: 200, face: 180 },
};
```

### Color Scheme
Edit `frontend/tailwind.config.js`:
```javascript
healthcare: {
  50: '#f0f9ff',
  500: '#0ea5e9',
  600: '#0284c7',
  // ... customize colors
}
```

---

## 🚨 Troubleshooting

### Avatar Not Visible
- Check browser console for errors
- Verify z-index values
- Clear browser cache (Ctrl+Shift+Delete)
- Test with fresh incognito window

### Voice Not Working
- Check microphone permissions
- Verify browser supports Web Speech API
- Check browser console for errors
- Firefox has limited support

### API Connection Failed
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS settings in backend
- Check network tab in DevTools

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string
- Whitelist IP in MongoDB Atlas
- Verify username/password

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Detailed setup instructions
- **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - Complete API reference
- **[CUSTOMIZATION.md](./docs/AVATAR_CUSTOMIZATION.md)** - Avatar styling guide

---

## 🔐 Security Notes

1. **Never commit .env files** with real credentials
2. **Use HTTPS in production**
3. **Validate all user inputs** on backend
4. **Implement rate limiting** for production
5. **Keep API keys secure** in environment variables
6. **Enable CORS only for trusted origins**
7. **Use strong JWT secrets**
8. **Implement CSRF protection** for forms

---

## 🚀 Deployment

### Deploy Backend (Heroku)
```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

### Deploy Frontend (Vercel)
```bash
vercel
# Set environment variables in dashboard
```

### Deploy with Docker
```bash
docker-compose up --build
```

---

## ⚖️ Legal Disclaimer

**Medical Disclaimer:** This system does not replace professional medical advice. Always consult with qualified healthcare professionals for diagnosis, treatment, or medical advice. In case of emergency, call your local emergency number or visit the nearest hospital.

---

## 📝 License

This project is provided as-is for educational purposes.

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support & Questions

For questions or issues:
1. Check the documentation
2. Review troubleshooting section
3. Check GitHub issues
4. Create a new issue with details

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- MongoDB for database
- Vercel for frontend hosting
- Heroku for backend hosting
- Open-source community

---

**Created:** January 2024
**Last Updated:** January 2024
**Version:** 1.0.0

---

## 🎯 Roadmap (Future Features)

- [ ] Advanced 3D avatar using Three.js or D-ID API
- [ ] Real-time wearable device integration
- [ ] Video consultation integration
- [ ] Prescription OCR using computer vision
- [ ] Advanced analytics dashboard
- [ ] Telemedicine features
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Payment integration for premium features
- [ ] Multi-language support expansion
- [ ] Machine learning for health predictions
- [ ] Integration with hospital management systems

---

**Happy Health Tracking! 💚🏥**
