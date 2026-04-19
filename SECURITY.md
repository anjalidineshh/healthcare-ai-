# Security Guidelines

## 🔐 Security Overview

This document outlines security best practices for the Healthcare AI Platform. Security is critical, especially for healthcare applications handling sensitive patient data.

## 📋 Table of Contents

- [Critical Security Checklist](#critical-security-checklist)
- [Environment & Credentials](#environment--credentials)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Frontend Security](#frontend-security)
- [Database Security](#database-security)
- [Deployment Security](#deployment-security)
- [Monitoring & Logging](#monitoring--logging)
- [Incident Response](#incident-response)
- [Compliance](#compliance)
- [Third-Party Integrations](#third-party-integrations)

---

## ✅ Critical Security Checklist

### Before Going to Production

- [ ] All `.env` files excluded from version control
- [ ] API keys rotated and secured
- [ ] HTTPS/SSL enabled on all endpoints
- [ ] CORS properly configured (no wildcards)
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens on all forms
- [ ] Authentication tokens properly stored
- [ ] Database backups configured
- [ ] Error messages don't leak sensitive info
- [ ] Secrets not logged or stored
- [ ] Dependencies security audit completed
- [ ] Penetration testing completed

---

## 🔑 Environment & Credentials

### ✅ DO

```bash
# Store in environment variables
OPENAI_API_KEY=sk-...
DATABASE_URL=mongodb+srv://user:pass@host/db
JWT_SECRET=generated-random-string-min-32-chars

# Use secure random generation
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Rotate keys regularly (at least quarterly)
# Keep multiple key versions for smooth rotation

# Use different secrets per environment
.env.development  (with test credentials)
.env.staging      (with staging credentials)
.env.production   (with production credentials)

# Use a secrets manager in production
# AWS Secrets Manager, HashiCorp Vault, etc.
```

### ❌ DON'T

```javascript
// ❌ NEVER hardcode credentials
const apiKey = 'sk-abc123...';

// ❌ NEVER commit .env files
git add .env  // DO NOT DO THIS

// ❌ NEVER use weak secrets
JWT_SECRET=password123  // Too weak!

// ❌ NEVER share secrets in code comments
// This is my OpenAI key: sk-abc123...

// ❌ NEVER log sensitive data
console.log('API Key:', apiKey);
logger.info({ password: userPassword });

// ❌ NEVER use same secret in all environments
// Must rotate and vary per environment
```

### .gitignore Template

```
# Environment
.env
.env.local
.env.*.local
.env.production.local

# Credentials
*.pem
*.key
*.crt

# Dependencies
node_modules/
.npm

# Build outputs
dist/
build/
*.bundle.js

# Logs
*.log
logs/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Temporary
tmp/
temp/
```

---

## 🔐 Authentication & Authorization

### JWT Best Practices

```javascript
// ✅ Good: Proper JWT implementation
const jwt = require('jsonwebtoken');

// Generate token with expiration
function generateToken(userId) {
  return jwt.sign(
    { userId, iat: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify and refresh
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Return expired token error
      throw new Error('Token expired');
    }
    throw err;
  }
}

// ❌ Bad: Weak JWT implementation
const token = jwt.sign({ userId }, 'secret');  // No expiration!
jwt.verify(token, 'secret');  // Hardcoded secret!
```

### Password Security

```javascript
// ✅ Good: Proper password hashing
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  // Validate password strength first
  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }
  
  // Hash with salt rounds (10-12 recommended)
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ❌ Bad: Insecure password handling
const hash = bcrypt.hashSync(password, 5);  // Too few salt rounds
const plainPassword = password;  // Storing plaintext!
password.includes('password');  // Weak validation
```

### Password Requirements

Enforce strong passwords:
- Minimum 12 characters
- Mix of uppercase and lowercase
- Include numbers and special characters
- No common patterns or dictionary words
- No usernames or emails in password

```javascript
function validatePasswordStrength(password) {
  const rules = [
    { regex: /.{12,}/, message: 'At least 12 characters' },
    { regex: /[a-z]/, message: 'Include lowercase letters' },
    { regex: /[A-Z]/, message: 'Include uppercase letters' },
    { regex: /[0-9]/, message: 'Include numbers' },
    { regex: /[!@#$%^&*]/, message: 'Include special characters' },
  ];

  const errors = rules
    .filter(rule => !rule.regex.test(password))
    .map(rule => rule.message);

  return { valid: errors.length === 0, errors };
}
```

### Session Management

```javascript
// ✅ Good: Secure session handling
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,  // Prevents JS access
    secure: true,    // HTTPS only
    sameSite: 'Strict',  // CSRF protection
    maxAge: 1000 * 60 * 60 * 24,  // 24 hours
  },
};

// ❌ Bad: Insecure session configuration
const badConfig = {
  secret: 'hardcoded-secret',
  cookie: {
    secure: false,  // HTTP allowed!
    sameSite: false,  // CSRF vulnerable!
  },
};
```

---

## 🛡️ Data Protection

### Encryption at Rest

```javascript
// ✅ Good: Encrypt sensitive data
const crypto = require('crypto');

function encryptData(data, encryptionKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

function decryptData(encrypted, encryptionKey) {
  const [iv, data] = encrypted.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Sensitive Field Masking

```javascript
// ✅ Good: Mask sensitive data in logs
function maskSensitiveData(obj) {
  const sensitiveFields = ['password', 'apiKey', 'ssn', 'creditCard'];
  
  const masked = { ...obj };
  sensitiveFields.forEach(field => {
    if (masked[field]) {
      masked[field] = '***REDACTED***';
    }
  });
  
  return masked;
}

// Usage
logger.info('User login:', maskSensitiveData(user));
```

### Data Retention

```javascript
// ✅ Good: Implement data retention policies
async function deleteOldData() {
  // Delete chat history older than 1 year
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  
  await ChatHistory.deleteMany({
    createdAt: { $lt: oneYearAgo }
  });
  
  // Delete login logs older than 90 days
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  await LoginLog.deleteMany({
    createdAt: { $lt: ninetyDaysAgo }
  });
}
```

---

## 🔌 API Security

### Rate Limiting

```javascript
// ✅ Good: Implement rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,  // Return rate limit info in headers
  legacyHeaders: false,  // Disable X-RateLimit-* headers
});

// Apply to specific routes
app.post('/api/auth/login', limiter, loginHandler);
app.post('/api/auth/register', limiter, registerHandler);

// Stricter limit for auth attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,  // Don't count successful requests
});

app.post('/api/auth/login', authLimiter, loginHandler);
```

### Input Validation

```javascript
// ✅ Good: Validate all inputs
const { body, validationResult } = require('express-validator');

app.post('/api/medicine/add', [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long')
    .escape(),  // Prevent XSS
  body('dosage')
    .trim()
    .notEmpty().withMessage('Dosage is required')
    .escape(),
  body('frequency')
    .isIn(['once_daily', 'twice_daily', 'thrice_daily'])
    .withMessage('Invalid frequency'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Process validated data
});

// ❌ Bad: No validation
app.post('/api/medicine/add', (req, res) => {
  // Directly use req.body!
  const medicine = req.body;  // Vulnerable!
});
```

### HTTPS/SSL

```javascript
// ✅ Good: Force HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// ❌ Bad: Allow HTTP in production
// No HTTPS enforcement
```

---

## 🌐 Frontend Security

### XSS Prevention

```jsx
// ✅ Good: Use safe rendering
import DOMPurify from 'dompurify';

function ChatMessage({ message }) {
  // DOMPurify sanitizes HTML
  const sanitized = DOMPurify.sanitize(message);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Better: Don't use dangerouslySetInnerHTML
function ChatMessage({ message }) {
  return <div>{message}</div>;  // Auto-escaped by React
}

// ❌ Bad: XSS vulnerability
function BadMessage({ message }) {
  return <div dangerouslySetInnerHTML={{ __html: message }} />;
}
```

### CSRF Protection

```jsx
// ✅ Good: Include CSRF token
<form method="POST" action="/api/medicine/add">
  <input type="hidden" name="csrf" value={csrfToken} />
  {/* Form fields */}
</form>

// Backend
app.post('/api/medicine/add', csrfProtection, (req, res) => {
  // CSRF token verified automatically
});
```

### Secure Token Storage

```javascript
// ✅ Good: Store in HttpOnly cookie
// Server sets after login
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// ❌ Bad: Store in localStorage
localStorage.setItem('token', jwtToken);  // XSS vulnerable!
```

---

## 🗄️ Database Security

### MongoDB Security

```javascript
// ✅ Good: Secure MongoDB connection
const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
    retryWrites: true,
    w: 'majority',  // Ensures data is replicated
  }
);

// ❌ Bad: Insecure connection
mongoose.connect('mongodb://localhost:27017/health');  // No auth!
```

### SQL Injection Prevention

```javascript
// ✅ Good: Use parameterized queries
// With Mongoose (native parameterization)
const user = await User.findById(userId);

// With MongoDB native
const result = await collection.findOne({ _id: new ObjectId(userId) });

// ❌ Bad: Query injection vulnerability
const result = await collection.findOne({
  _id: userId  // If userId is user input, vulnerable!
});
```

### Data Indexing & Performance

```javascript
// ✅ Good: Index frequently queried fields
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
medicineSchema.index({ userId: 1, isActive: 1 });

// Compound index for common queries
appointmentSchema.index({ userId: 1, date: 1 });
```

---

## 🚀 Deployment Security

### Environment-Specific Configuration

```javascript
// ✅ Good: Different configs per environment
const config = {
  development: {
    debug: true,
    logLevel: 'debug',
    allowedOrigins: ['http://localhost:3000'],
  },
  staging: {
    debug: false,
    logLevel: 'info',
    allowedOrigins: ['https://staging.healthcare-ai.com'],
  },
  production: {
    debug: false,
    logLevel: 'warn',
    allowedOrigins: ['https://healthcare-ai.com'],
  },
};

const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];
```

### CORS Configuration

```javascript
// ✅ Good: Strict CORS policy
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ❌ Bad: Insecure CORS
app.use(cors());  // Allows all origins!
```

### Headers Security

```javascript
// ✅ Good: Set security headers
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],  // Only if necessary
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  },
}));

// ❌ Bad: No security headers
// Missing helmet middleware
```

---

## 📊 Monitoring & Logging

### Secure Logging

```javascript
// ✅ Good: Log securely
function createLogger() {
  return {
    info: (msg, data = {}) => {
      // Mask sensitive fields
      const masked = maskSensitiveData(data);
      console.log(`[INFO] ${msg}`, masked);
    },
    error: (msg, err = {}) => {
      // Never log stack traces in production
      if (process.env.NODE_ENV === 'production') {
        console.error(`[ERROR] ${msg}`);
      } else {
        console.error(`[ERROR] ${msg}`, err.stack);
      }
    },
  };
}

// ❌ Bad: Insecure logging
logger.info('User login', { password: user.password });  // Logs password!
logger.error(error.stack);  // Exposes system details!
```

### Security Monitoring

```javascript
// ✅ Good: Monitor for suspicious activity
async function logSecurityEvent(event) {
  await SecurityLog.create({
    event: event.type,
    userId: event.userId,
    ipAddress: event.ipAddress,
    userAgent: event.userAgent,
    timestamp: new Date(),
    severity: event.severity,  // 'info', 'warning', 'critical'
  });
  
  // Alert on critical events
  if (event.severity === 'critical') {
    await sendSecurityAlert(event);
  }
}

// Track failed login attempts
async function trackFailedLogin(email, ip) {
  const attempts = await LoginAttempt.countDocuments({
    email,
    ipAddress: ip,
    timestamp: { $gt: new Date(Date.now() - 15 * 60 * 1000) }
  });
  
  if (attempts > 5) {
    // Block further attempts
    throw new Error('Too many failed login attempts');
  }
}
```

---

## 🚨 Incident Response

### Security Incident Procedure

1. **Detect**: Monitor logs and alerts
2. **Contain**: Stop the attack/breach
3. **Investigate**: Determine what happened
4. **Notify**: Inform affected users if needed
5. **Remediate**: Fix the vulnerability
6. **Document**: Record lessons learned

### Emergency Contacts

```
Security Team: security@healthcare-ai.com
Incident Hotline: +1-XXX-XXX-XXXX
On-Call Engineer: (PagerDuty or similar)
```

### Breach Response Checklist

- [ ] Take affected systems offline if necessary
- [ ] Preserve logs and evidence
- [ ] Notify security team immediately
- [ ] Assess data compromised
- [ ] Determine notification requirements (GDPR, HIPAA)
- [ ] Prepare user notifications
- [ ] Contact legal team
- [ ] Work with cybersecurity firm if needed
- [ ] Post-incident analysis within 7 days

---

## ⚖️ Compliance

### HIPAA Compliance (USA)

- [ ] Encryption in transit (HTTPS)
- [ ] Encryption at rest
- [ ] Access controls & authentication
- [ ] Audit logs for all access
- [ ] Business Associate Agreement (BAA)
- [ ] Regular security assessments
- [ ] Incident response plan

### GDPR Compliance (EU)

- [ ] Data processing agreement
- [ ] User consent for processing
- [ ] Right to access user data
- [ ] Right to be forgotten (data deletion)
- [ ] Data breach notification (72 hours)
- [ ] Privacy impact assessment
- [ ] Data protection officer (if required)

### Regular Audits

```bash
# Dependency security audit
npm audit

# OWASP vulnerability scan
npm install -g snyk
snyk test

# Code quality & security
sonarqube scan

# Penetration testing (quarterly)
# Use professional penetration testing firm
```

---

## 🔗 Third-Party Integrations

### API Key Management

```javascript
// ✅ Good: Secure API key usage
const openaiApiKey = process.env.OPENAI_API_KEY;

// Use API keys for each third party in separate env vars
const emailApiKey = process.env.SENDGRID_API_KEY;
const twilioApiKey = process.env.TWILIO_AUTH_TOKEN;

// Rotate keys regularly
// Store in secrets manager in production

// ❌ Bad: Insecure key handling
const apiKey = 'sk-abc123';  // Hardcoded!
fetch(`/api/openai?key=${apiKey}`);  // In URL!
```

### Dependency Management

```bash
# Keep dependencies updated
npm update

# Check for vulnerabilities
npm audit

# Review before updating major versions
npm outdated

# Use lock files
npm ci  # Instead of npm install in CI/CD
```

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/)
- [GDPR Compliance Guide](https://gdpr-info.eu/)

---

## ✅ Security Checklist Recap

### Before Development
- [ ] Define security requirements
- [ ] Use secure development practices
- [ ] Code review with security focus

### Before Staging
- [ ] Run security audit
- [ ] Fix all vulnerabilities
- [ ] Update dependencies

### Before Production
- [ ] Penetration testing completed
- [ ] Security review approved
- [ ] Incident response plan in place
- [ ] Monitoring & alerting configured
- [ ] Backup & disaster recovery tested

### After Deployment
- [ ] Monitor security logs daily
- [ ] Update and patch regularly
- [ ] Conduct security training
- [ ] Review incidents within 24 hours

---

**Last Updated:** January 2024  
**Version:** 1.0

---

<div align="center">

**Security is everyone's responsibility.**

[Report a Security Issue](mailto:security@healthcare-ai.com) • [View Code of Conduct](./CODE_OF_CONDUCT.md)

</div>
