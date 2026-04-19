## 🏗️ HEALTHCARE AI CHATBOT - ARCHITECTURE & DATA FLOW

### 🎯 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     FRONTEND (Next.js + React)                   │   │
│  │                                                                   │   │
│  │  ┌────────────────────────┐      ┌──────────────────────┐       │   │
│  │  │   Floating Avatar      │      │   Main Dashboard     │       │   │
│  │  ├────────────────────────┤      │  ┌────────────────┐  │       │   │
│  │  │ • AvatarFace (3D SVG)  │      │  │ Medicines List │  │       │   │
│  │  │ • Chat Panel           │      │  │ Appointments   │  │       │   │
│  │  │ • Expressions          │      │  │ Health Metrics │  │       │   │
│  │  │ • Voice Control        │      │  └────────────────┘  │       │   │
│  │  │ • Mic & Speakers       │      │                      │       │   │
│  │  └────────────────────────┘      └──────────────────────┘       │   │
│  │                                                                   │   │
│  │  ┌────────────────────────┐      ┌──────────────────────┐       │   │
│  │  │  State Management      │      │   Local Storage      │       │   │
│  │  │  (Zustand)             │      │  • JWT Token         │       │   │
│  │  │  • avatarStore         │      │  • User Data         │       │   │
│  │  │  • messages            │      │  • Preferences       │       │   │
│  │  │  • expressions         │      └──────────────────────┘       │   │
│  │  └────────────────────────┘                                      │   │
│  │                                                                   │   │
│  │  ┌────────────────────────┐      ┌──────────────────────┐       │   │
│  │  │   Hooks                │      │   Web APIs           │       │   │
│  │  │  • useVoiceRecognition │      │  • Speech-to-Text    │       │   │
│  │  │  • useSpeechSynthesis  │      │  • Text-to-Speech    │       │   │
│  │  │  • useSocket           │      │  • Microphone        │       │   │
│  │  └────────────────────────┘      └──────────────────────┘       │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │              HTTP/WebSocket Connection                   │   │   │
│  │  │         ↓ Axios ↑ Socket.io (Real-time)                │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express.js)                             │
│                      localhost:5000                                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │              REST API Endpoints                                │   │
│  │                                                                │   │
│  │  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐      │   │
│  │  │ /api/auth    │  │ /api/chat  │  │ /api/medicine    │      │   │
│  │  ├──────────────┤  ├────────────┤  ├──────────────────┤      │   │
│  │  │ register     │  │ send       │  │ add              │      │   │
│  │  │ login        │  │ symptom-   │  │ list             │      │   │
│  │  │ profile      │  │   check    │  │ log-adherence    │      │   │
│  │  │ update       │  │ history    │  │ adherence        │      │   │
│  │  └──────────────┘  └────────────┘  └──────────────────┘      │   │
│  │                                                                │   │
│  │  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐      │   │
│  │  │ /api/health  │  │ /api/apt   │  │ /api/notif       │      │   │
│  │  ├──────────────┤  ├────────────┤  ├──────────────────┤      │   │
│  │  │ metric       │  │ book       │  │ get              │      │   │
│  │  │ metrics      │  │ list       │  │ read             │      │   │
│  │  │ history      │  │ confirm    │  │ read-all         │      │   │
│  │  └──────────────┘  └────────────┘  └──────────────────┘      │   │
│  │                                                                │   │
│  │  ┌─────────────────────────────────────────────────────┐     │   │
│  │  │         WebSocket Event Handlers (Socket.io)        │     │   │
│  │  │  • join (user joins room)                            │     │   │
│  │  │  • chat-message (real-time chat)                     │     │   │
│  │  │  • medicine-taken (adherence tracking)               │     │   │
│  │  │  • disconnect (cleanup)                              │     │   │
│  │  └─────────────────────────────────────────────────────┘     │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │           Middleware & Authentication (JWT)                    │   │
│  │  • Token Verification                                          │   │
│  │  • Error Handling                                              │   │
│  │  • CORS Protection                                             │   │
│  │  • Input Validation                                            │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │         Business Logic & Services Layer                        │   │
│  │                                                                │   │
│  │  ┌────────────────────────────────────────────────────┐      │   │
│  │  │  AI Service (aiService.js)                         │      │   │
│  │  │  • getChatResponse()      ─────→ OpenAI API       │      │   │
│  │  │  • analyzeSymptoms()                               │      │   │
│  │  │  • detectEmotion()                                 │      │   │
│  │  │  • detectEmergency()                               │      │   │
│  │  └────────────────────────────────────────────────────┘      │   │
│  │                                                                │   │
│  │  ┌────────────────────────────────────────────────────┐      │   │
│  │  │  Cron Jobs (node-cron)                             │      │   │
│  │  │  • checkMedicineReminders()  (every 5 mins)       │      │   │
│  │  │  • sendAppointmentReminders() (daily at 9 AM)     │      │   │
│  │  └────────────────────────────────────────────────────┘      │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │         Data Access Layer (Mongoose ODM)                       │   │
│  │  • User Model                                                  │   │
│  │  • ChatMessage Model                                           │   │
│  │  • MedicineReminder Model                                      │   │
│  │  • HealthMetric Model                                          │   │
│  │  • Appointment Model                                           │   │
│  │  • Notification Model                                          │   │
│  │  • EmergencyAlert Model                                        │   │
│  │  • SymptomChecker Model                                        │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                                  │
│                                                                          │
│  ┌────────────────────────────────────────┐                            │
│  │  MongoDB (NoSQL Database)              │                            │
│  │  localhost:27017 (local)               │                            │
│  │  OR Atlas Cloud                        │                            │
│  │                                        │                            │
│  │  Collections:                          │                            │
│  │  • users                               │                            │
│  │  • chat_messages                       │                            │
│  │  • medicine_reminders                  │                            │
│  │  • health_metrics                      │                            │
│  │  • appointments                        │                            │
│  │  • notifications                       │                            │
│  │  • emergency_alerts                    │                            │
│  │  • symptom_checker                     │                            │
│  │  • prescriptions                       │                            │
│  └────────────────────────────────────────┘                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                    │
│                                                                          │
│  ┌──────────────────────────┐      ┌────────────────────────────┐     │
│  │  OpenAI API              │      │  Browser APIs              │     │
│  │  • GPT-4 Model           │      │  • Web Speech API          │     │
│  │  • Chat Completions      │      │  • Speech Synthesis API    │     │
│  │  • Context Handling       │      │  • Geolocation API        │     │
│  │  • Emotion Detection     │      │  • Microphone Access       │     │
│  └──────────────────────────┘      └────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🔄 Data Flow Diagrams

#### **1. Chat Message Flow**

```
User Types Message
       ↓
Frontend: handleSendMessage()
       ↓
POST /api/chat/send
  {
    message: "I have a headache",
    conversationId: "conv_123"
  }
       ↓
Backend: verifyToken() [JWT Auth]
       ↓
Backend: Get user profile + conversation history
       ↓
aiService.getChatResponse()
       ↓
Call OpenAI API with context
       ↓
Receive AI response + emotion
       ↓
Save to MongoDB
  • User message
  • AI response
       ↓
Return response with emotion
       ↓
Frontend: Display message + expression
       ↓
useSpeechSynthesis(): Speak response
       ↓
Avatar shows expression change
```

#### **2. Medicine Reminder Flow**

```
User: POST /api/medicine/add
  {
    medicineName: "Aspirin",
    dosage: "500mg",
    reminderTimes: ["08:00", "20:00"]
  }
       ↓
Save to MongoDB: medicine_reminders
       ↓
Cron Job runs every 5 minutes
       ↓
Check current time vs reminderTimes
       ↓
If match found:
  • Create Notification in DB
  • Emit Socket.io event
       ↓
Frontend receives notification
       ↓
Avatar shows "concerned" expression
       ↓
Text-to-Speech: "Time to take your medicine"
       ↓
User clicks "Took Medicine"
       ↓
POST /api/medicine/log-adherence
  {
    reminderId: "med_123",
    time: "08:15",
    taken: true
  }
       ↓
Update adherence tracking
       ↓
Calculate adherence percentage
```

#### **3. Voice Input Flow**

```
User clicks Microphone
       ↓
useVoiceRecognition.startListening()
       ↓
Browser Web Speech API activates
       ↓
User speaks: "I have a fever"
       ↓
Speech Recognition converts to text
       ↓
Transcript: "I have a fever"
       ↓
Frontend: handleSendMessage(transcript)
       ↓
[Same as Chat Message Flow]
       ↓
AI responds: "When did this fever start?"
       ↓
useSpeechSynthesis.speak(response)
       ↓
Browser Web Speech API speaks text
       ↓
Avatar mouth moves during speech
```

#### **4. Symptom Checker Flow**

```
User indicates symptoms
       ↓
POST /api/chat/symptom-check
  {
    symptoms: ["fever", "cough", "fatigue"],
    conversationId: "sym_123"
  }
       ↓
aiService.analyzeSymptoms()
       ↓
Build specialized system prompt
       ↓
Call OpenAI with symptom context
       ↓
AI returns:
  • Clarifying questions
  • Possible conditions
  • Severity level
  • Doctor recommendation
       ↓
Check for emergency keywords
       ↓
Save to MongoDB: symptom_checker
       ↓
Return analysis to frontend
       ↓
If emergency:
  • Avatar shows "concerned"
  • Strong doctor recommendation
  • Show emergency contacts
       ↓
If moderate:
  • Avatar shows "thinking"
  • Suggest scheduling appointment
       ↓
If mild:
  • Avatar shows "happy"
  • Self-care suggestions
```

#### **5. Authentication Flow**

```
User: POST /api/auth/register
  {
    email: "user@example.com",
    password: "SecurePass123",
    firstName: "John"
  }
       ↓
Backend: Hash password with bcrypt
       ↓
Check user doesn't exist
       ↓
Create user in MongoDB
       ↓
Generate JWT token
       ↓
generateToken(userId)
       ↓
Sign with JWT_SECRET
       ↓
Expires in 7 days
       ↓
Return token to frontend
       ↓
Frontend: Store in localStorage/sessionStorage
       ↓
OR Login: POST /api/auth/login
  {
    email: "user@example.com",
    password: "SecurePass123"
  }
       ↓
Backend: Find user in MongoDB
       ↓
Compare password with bcrypt
       ↓
If match: generate JWT token
       ↓
If mismatch: return error
       ↓
Future requests:
       ↓
Include: Authorization: Bearer TOKEN
       ↓
Backend: verifyToken() middleware
       ↓
Decode token with JWT_SECRET
       ↓
Attach user info to req.user
       ↓
Proceed to route handler
```

---

### 🗂️ Database Relationships

```
┌─────────────┐
│   Users     │
├─────────────┤
│ _id: email  │
│ password    │
│ firstName   │
│ healthProf  │
└─────────────┘
      │
      │ (one-to-many)
      ├──────────────────────────────────────┬──────────────┬────────────┐
      ↓                                      ↓              ↓            ↓
┌─────────────────┐  ┌────────────────┐ ┌──────────┐ ┌────────┐ ┌────────────┐
│ ChatMessages    │  │ MedicineRmnd   │ │Appoint   │ │Notif   │ │HealthMetr  │
├─────────────────┤  ├────────────────┤ ├──────────┤ ├────────┤ ├────────────┤
│ userId [FK]     │  │ userId [FK]    │ │userId[FK]│ │userId[]│ │ userId[FK] │
│ conversationId  │  │ medicineName   │ │ doctorName││ type   │ │ metricType │
│ role            │  │ dosage         │ │ apt date │ │ title  │ │ value      │
│ content         │  │ reminderTimes  │ │ status   │ │ message│ │ recordedAt │
│ emotion         │  │ adherence[]    │ │ reminder │ │ read   │ │            │
│ timestamp       │  │ isActive       │ │ sent     │ │priority│ │            │
└─────────────────┘  └────────────────┘ └──────────┘ └────────┘ └────────────┘
```

---

### 🔐 Security Flow

```
HTTP Request
    ↓
┌─────────────────────────────┐
│ CORS Middleware             │
│ Check allowed origins       │
└─────────────────────────────┘
    ↓ [PASS]
┌─────────────────────────────┐
│ Extract JWT Token           │
│ From: Authorization header  │
└─────────────────────────────┘
    ↓ [Token exists?]
┌─────────────────────────────┐
│ Verify JWT Signature        │
│ Using: JWT_SECRET           │
└─────────────────────────────┘
    ↓ [Signature valid?]
┌─────────────────────────────┐
│ Check Token Expiration      │
│ Issued at: timestamp        │
└─────────────────────────────┘
    ↓ [Not expired?]
┌─────────────────────────────┐
│ Attach User to req.user     │
│ {id, iat, exp}              │
└─────────────────────────────┘
    ↓ [Continue to route]
┌─────────────────────────────┐
│ Validate Request Input      │
│ Check required fields       │
└─────────────────────────────┘
    ↓ [Valid input?]
┌─────────────────────────────┐
│ Execute Route Handler       │
│ Access database             │
└─────────────────────────────┘
    ↓
Return Response
    ↓
┌─────────────────────────────┐
│ [FAIL] Error Response       │
│ 401: Unauthorized           │
│ 400: Bad Request            │
│ 500: Server Error           │
└─────────────────────────────┘
```

---

### 📊 Real-time Communication (WebSocket)

```
CLIENT                          SERVER
   │                               │
   │─────── socket.emit('join') ──→│
   │                               │
   │◄─ acknowledge + setup room ──│
   │                               │
   │─ socket.emit('chat-message')→│
   │                               │
   │◄─ socket.on('chat-update') ──│
   │                               │
   │─ socket.emit('medicine-taken')→│
   │                               │
   │◄─ socket.on('medicine-logged')│
   │                               │
   │─────── disconnect ───────────→│
   │                               │
   │◄─ socket.on('disconnect') ───│
```

---

### 🎯 Avatar State Machine

```
START
  ↓
┌─────────────────┐
│    COLLAPSED    │     ← Initial state
│  • Small bubble │       • Size: 64px
│  • Draggable    │       • Position: bottom-right
│  • Breathing    │       • Icon visible
│  • Pulsing ring │
└─────────────────┘
  ↓ [User clicks]
┌─────────────────┐
│   EXPANDING     │     ← Transition
│  • Scale up     │       • Duration: 300ms
│  • Fade in      │       • Smooth animation
│  • Show panel   │
└─────────────────┘
  ↓ [Animation complete]
┌─────────────────┐
│   EXPANDED      │     ← Chat mode
│  • Full panel   │       • Size: 384px
│  • Chat active  │       • Expressions visible
│  • Voice ready  │       • Input focused
│  • Avatar large │
└─────────────────┘
  ↓ [User types/speaks]
┌─────────────────┐
│   PROCESSING    │     ← AI thinking
│  • Thinking exp │       • Spinning loader
│  • Disabled inp │       • "Processing..."
│  • Waiting...   │
└─────────────────┘
  ↓ [Response received]
┌─────────────────┐
│   RESPONDING    │     ← Speaking
│  • Mouth move   │       • TTS playing
│  • Expression   │       • Message visible
│  • Audio active │
└─────────────────┘
  ↓ [Speech ends]
┌─────────────────┐
│   READY         │     ← Waiting for input
│  • Expression   │       • Ready to chat
│  • Input focus  │       • Can speak again
│  • Listening    │
└─────────────────┘
  ↓ [User clicks X]
┌─────────────────┐
│   COLLAPSING    │     ← Transition
│  • Scale down   │       • Duration: 300ms
│  • Fade out     │       • Smooth animation
└─────────────────┘
  ↓ [Animation complete]
BACK TO COLLAPSED
```

---

## 📋 Request/Response Examples

### **Chat Request**

```json
REQUEST:
POST http://localhost:5000/api/chat/send
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "message": "I have a headache",
  "conversationId": "conv_123456",
  "context": {
    "messages": [
      {
        "role": "assistant",
        "content": "Hi! How can I help you?"
      }
    ]
  }
}

RESPONSE:
HTTP 200 OK

{
  "success": true,
  "message": "Can you describe where the headache is? Is it on one side or both?",
  "emotion": "concerned",
  "conversationId": "conv_123456"
}
```

### **Medicine Reminder Request**

```json
REQUEST:
POST http://localhost:5000/api/medicine/add
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "medicineName": "Aspirin",
  "dosage": "500mg",
  "frequency": "twice",
  "reminderTimes": ["08:00", "20:00"],
  "startDate": "2024-01-15",
  "reason": "Headache relief"
}

RESPONSE:
HTTP 200 OK

{
  "success": true,
  "message": "Medicine reminder added",
  "reminderData": {
    "_id": "med_123",
    "medicineName": "Aspirin",
    "dosage": "500mg",
    "reminderTimes": ["08:00", "20:00"],
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

**This architecture ensures scalability, maintainability, and real-time responsiveness! 🚀**
