# Contributing to Healthcare AI Platform

Thank you for your interest in contributing to Healthcare AI! We're excited to work with you. This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Types](#contribution-types)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Review Process](#review-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

**As a contributor, you agree to:**
- Be respectful of differing opinions and experiences
- Use welcoming and inclusive language
- Provide and accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

**Unacceptable behavior includes:**
- Harassment of any kind
- Discrimination based on any characteristic
- Unwelcome sexual attention
- Trolling or deliberate disruption
- Violation of others' privacy

**Consequences:**
Unacceptable behavior will result in a warning, temporary or permanent ban from the community.

---

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Visit https://github.com/anjalidineshh/healthcare-ai
# Click "Fork" button in top-right corner
```

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/healthcare-ai.git
cd healthcare-ai
git remote add upstream https://github.com/anjalidineshh/healthcare-ai.git
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bugs:
git checkout -b fix/bug-name
# or for docs:
git checkout -b docs/documentation-topic
```

---

## 💻 Development Setup

### Prerequisites
- Node.js v18+ and npm v9+
- MongoDB v5.0+
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## 🎯 Contribution Types

### Bug Fixes
```bash
git checkout -b fix/issue-title
git commit -m "fix: brief description of fix"
```

### Features
```bash
git checkout -b feature/feature-name
git commit -m "feat: brief description of feature"
```

### Documentation
```bash
git checkout -b docs/doc-topic
git commit -m "docs: update documentation"
```

---

## 📝 Commit Guidelines

Use conventional commits format:

```
<type>(<scope>): <subject>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Dependencies, config

**Examples:**
```bash
git commit -m "feat(avatar): add expression animation"
git commit -m "fix(chat): resolve message ordering"
git commit -m "docs(setup): update instructions"
```

---

## 🔄 Pull Request Process

### Before Creating PR

```bash
# Update your branch
git fetch upstream
git rebase upstream/main

# Test your changes
npm test
npm run lint
npm run format
```

### Creating PR

1. Push to your fork
2. Create Pull Request on GitHub
3. Fill in the PR template
4. Reference related issues: `Closes #123`

---

## 📐 Coding Standards

### Backend Style

```javascript
// ✅ Good: Clear, documented
async function sendMessage(userId, message) {
  const validation = validateMessage(message);
  if (!validation.isValid) {
    throw new ValidationError(validation.errors);
  }
  
  const response = await openai.createCompletion({
    prompt: message,
    max_tokens: 2000,
  });
  
  return response;
}

// ❌ Bad: Unclear
function send(u, m) {
  return openai.createCompletion(m);
}
```

### Frontend Components

```jsx
// ✅ Good: Clear structure
const MedicineCard = ({ medicine, onRemove, isLoading }) => {
  return (
    <div className="medicine-card">
      <h3>{medicine.name}</h3>
      <p>{medicine.dosage}</p>
      <button onClick={() => onRemove(medicine.id)}>Remove</button>
    </div>
  );
};

// ❌ Bad: Unclear naming
const MC = ({ m, r }) => {
  // ...
};
```

### Naming Conventions

- **Components**: PascalCase (`ChatPanel`, `AvatarFace`)
- **Functions**: camelCase (`validateEmail`, `fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_TIMEOUT`)
- **CSS Classes**: kebab-case (`avatar-container`, `medicine-card__header`)

---

## 🧪 Testing Requirements

### Before PR

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Linting
npm run lint

# Formatting
npm run format
```

### Testing Checklist

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Manual testing completed
- [ ] Edge cases tested

---

## 📚 Documentation

### Update Documentation When

- Adding new API endpoints → Update `docs/API_DOCUMENTATION.md`
- Adding setup requirements → Update `docs/SETUP_GUIDE.md`
- Adding major features → Update `README.md`
- Complex logic → Add JSDoc comments

### JSDoc Format

```javascript
/**
 * Send message to AI and get response
 * 
 * @param {string} userId - User ID
 * @param {string} message - User message
 * @returns {Promise<Object>} AI response
 */
async function sendMessage(userId, message) {
  // Implementation
}
```

---

## 👀 Review Process

### Reviewers Look For

1. ✅ Code quality and style
2. ✅ Tests and coverage
3. ✅ Documentation
4. ✅ Performance
5. ✅ Security

### Addressing Feedback

```bash
git add .
git commit -m "refactor: address review feedback"
git push origin feature/your-feature-name
```

---

## 🐛 Reporting Bugs

**Use GitHub Issue with template:**

```
## Bug Description
[Clear description]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
[What should happen]

## Actual Behavior
[What happens instead]

## Environment
- Browser/OS
- App Version

## Screenshots
[Attach screenshots]
```

---

## 💡 Feature Requests

**Use GitHub Issue with template:**

```
## Feature Description
[Clear description]

## Use Case
[Why is this needed]

## Benefits
[What problems it solves]

## Implementation Idea
[Optional suggestions]
```

---

## 📞 Questions?

- Create a discussion on GitHub
- Ask in issue comments
- Email: contributors@healthcare-ai.com

---

**Thank you for contributing!** 🙏

Your contributions make Healthcare AI better for everyone.

---

**Last Updated:** January 2024
