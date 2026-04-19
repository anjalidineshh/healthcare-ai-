## 📡 Healthcare Chatbot - API Documentation

### Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://your-api-domain.com`

### Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 👤 Authentication Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user@example.com",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user@example.com",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "healthProfile": { ... }
  }
}
```

### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "user": {
    "_id": "user@example.com",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "healthProfile": {
      "age": 30,
      "gender": "male",
      "bloodType": "O+",
      "allergies": ["Penicillin"],
      "medicalConditions": ["Hypertension"]
    },
    "language": "en",
    "voiceEnabled": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Update Health Profile
```
POST /api/auth/update-health-profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "age": 30,
  "gender": "male",
  "bloodType": "O+",
  "height": 180,
  "weight": 75,
  "allergies": ["Penicillin", "Sulfa"],
  "medicalConditions": ["Hypertension"],
  "currentMedications": ["Lisinopril"],
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+91 98765 43210",
    "relation": "Spouse"
  }
}

Response (200):
{
  "success": true,
  "message": "Health profile updated",
  "healthProfile": { ... }
}
```

---

## 💬 Chat Endpoints

### Send Chat Message
```
POST /api/chat/send
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "message": "I have a headache that won't go away",
  "conversationId": "conv_123456",
  "context": {
    "messages": [
      {
        "role": "assistant",
        "content": "Hi, how can I help?"
      }
    ]
  }
}

Response (200):
{
  "success": true,
  "message": "Can you describe the location and intensity of your headache?",
  "emotion": "concerned",
  "conversationId": "conv_123456"
}
```

### Symptom Checker
```
POST /api/chat/symptom-check
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "symptoms": ["cough", "fever", "shortness of breath"],
  "conversationId": "sym_789"
}

Response (200):
{
  "success": true,
  "message": "I understand you're experiencing cough, fever, and shortness of breath. These symptoms can indicate several conditions...",
  "severity": "moderate",
  "shouldSeekDoctor": true,
  "isEmergency": false,
  "conversationId": "sym_789"
}
```

### Get Conversation History
```
GET /api/chat/history/conv_123456
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "conversationId": "conv_123456",
  "messages": [
    {
      "_id": "msg_1",
      "role": "user",
      "content": "I have a headache",
      "emotion": "neutral",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "_id": "msg_2",
      "role": "assistant",
      "content": "Can you describe...",
      "emotion": "concerned",
      "createdAt": "2024-01-15T10:01:00Z"
    }
  ]
}
```

### Delete Conversation
```
DELETE /api/chat/conversation/conv_123456
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "message": "Conversation deleted"
}
```

---

## 💊 Medicine Reminder Endpoints

### Add Medicine Reminder
```
POST /api/medicine/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "medicineName": "Aspirin",
  "dosage": "500mg",
  "frequency": "twice",
  "reminderTimes": ["08:00", "20:00"],
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "reason": "Headache relief"
}

Response (200):
{
  "success": true,
  "message": "Medicine reminder added",
  "reminderData": {
    "_id": "med_123",
    "userId": "user@example.com",
    "medicineName": "Aspirin",
    "dosage": "500mg",
    "frequency": "twice",
    "reminderTimes": ["08:00", "20:00"],
    "isActive": true,
    "adherence": [],
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Medicine Reminders
```
GET /api/medicine/list
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "reminders": [
    {
      "_id": "med_123",
      "medicineName": "Aspirin",
      "dosage": "500mg",
      "frequency": "twice",
      "reminderTimes": ["08:00", "20:00"],
      "isActive": true,
      "adherence": [
        {
          "date": "2024-01-15",
          "taken": true,
          "time": "08:15",
          "notes": "With breakfast"
        }
      ]
    }
  ],
  "count": 1
}
```

### Log Medicine Adherence
```
POST /api/medicine/log-adherence
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reminderId": "med_123",
  "time": "08:15",
  "notes": "Took with breakfast"
}

Response (200):
{
  "success": true,
  "message": "Medicine adherence logged"
}
```

### Get Adherence Report
```
GET /api/medicine/adherence/med_123
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "medicine": "Aspirin",
  "adherenceRate": 95,
  "takenDays": 19,
  "totalDays": 20,
  "adherence": [
    {
      "date": "2024-01-15",
      "taken": true,
      "time": "08:15",
      "notes": "With breakfast"
    }
  ]
}
```

### Delete Medicine Reminder
```
DELETE /api/medicine/med_123
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "message": "Medicine reminder deactivated"
}
```

---

## 🏥 Health Metrics Endpoints

### Record Health Metric
```
POST /api/health/metric
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "metricType": "blood_pressure",
  "value": 120,
  "unit": "mmHg",
  "notes": "Morning reading"
}

// Available metricTypes:
// - blood_pressure (value in mmHg)
// - heart_rate (value in bpm)
// - blood_sugar (value in mg/dL)
// - weight (value in kg)
// - temperature (value in °C)
// - sleep_hours (value in hours)

Response (200):
{
  "success": true,
  "message": "Health metric recorded",
  "metric": {
    "_id": "metric_123",
    "userId": "user@example.com",
    "metricType": "blood_pressure",
    "value": 120,
    "unit": "mmHg",
    "isAbnormal": false,
    "recordedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Metrics by Type
```
GET /api/health/metrics/blood_pressure?days=30
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "type": "blood_pressure",
  "metrics": [
    {
      "_id": "metric_123",
      "metricType": "blood_pressure",
      "value": 120,
      "unit": "mmHg",
      "recordedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 15
}
```

---

## 📅 Appointment Endpoints

### Book Appointment
```
POST /api/appointments/book
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "doctorName": "Dr. Sharma",
  "specialty": "General Physician",
  "clinicName": "HealthPlus Clinic",
  "appointmentDate": "2024-02-01T14:30:00",
  "duration": 30,
  "notes": "Annual checkup"
}

Response (200):
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "apt_123",
    "userId": "user@example.com",
    "doctorName": "Dr. Sharma",
    "appointmentDate": "2024-02-01T14:30:00",
    "status": "scheduled",
    "reminderSent": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Appointments
```
GET /api/appointments/list?status=scheduled
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "appointments": [
    {
      "_id": "apt_123",
      "doctorName": "Dr. Sharma",
      "appointmentDate": "2024-02-01T14:30:00",
      "status": "scheduled"
    }
  ],
  "count": 1
}
```

### Confirm Appointment
```
POST /api/appointments/apt_123/confirm
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "message": "Appointment confirmed",
  "appointment": { ... }
}
```

---

## 🔔 Notification Endpoints

### Get Notifications
```
GET /api/notifications?unread=true
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "notifications": [
    {
      "_id": "notif_123",
      "userId": "user@example.com",
      "type": "medicine",
      "title": "Time to take Aspirin",
      "message": "Take 500mg of Aspirin",
      "priority": "high",
      "read": false,
      "createdAt": "2024-01-15T08:00:00Z"
    }
  ],
  "unreadCount": 3,
  "totalCount": 10
}
```

### Mark Notification as Read
```
PATCH /api/notifications/notif_123/read
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "notification": { ... }
}
```

### Mark All as Read
```
PATCH /api/notifications/read-all
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### Delete Notification
```
DELETE /api/notifications/notif_123
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## 🆘 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (token missing/invalid)
- **404**: Not Found
- **500**: Server Error

### Example Errors

**Missing Token:**
```json
{
  "success": false,
  "error": "No token provided"
}
```

**Invalid Credentials:**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**User Already Exists:**
```json
{
  "success": false,
  "error": "User already exists"
}
```

---

## 🧪 Using cURL to Test

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test Chat
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache",
    "conversationId": "conv_1"
  }'
```

### Test Medicine
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/medicine/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Aspirin",
    "dosage": "500mg",
    "frequency": "twice",
    "reminderTimes": ["08:00", "20:00"]
  }'
```

---

## 📚 Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing:
- 100 requests per minute per IP
- 1000 requests per day per user

---

## 🔄 WebSocket Events (Socket.io)

### Client → Server

```javascript
// User joins their room
socket.emit('join', userId);

// Send chat message
socket.emit('chat-message', {
  userId: 'user@example.com',
  message: 'Hello',
  conversationId: 'conv_123'
});

// Log medicine taken
socket.emit('medicine-taken', {
  userId: 'user@example.com',
  medicineId: 'med_123',
  time: '08:15'
});
```

### Server → Client

```javascript
// Chat update
socket.on('chat-update', data);

// Medicine logged
socket.on('medicine-logged', data);

// Chat error
socket.on('chat-error', data);
```

---

**Last Updated:** January 2024
**API Version:** 1.0.0
