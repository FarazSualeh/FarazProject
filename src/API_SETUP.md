# Django MongoDB Backend API Setup Guide

This document explains how to connect the STEM Learning Platform frontend to a Django + MongoDB backend via REST API.

## Overview

The platform is designed to work in two modes:
1. **DEMO MODE**: All data stored locally in browser (no backend required)
2. **PRODUCTION MODE**: Connected to Django + MongoDB backend via REST API

## Frontend Configuration

### Environment Variables

1. Copy `.env.example` to `.env`
2. Configure the following variables:

```bash
# Django Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000/api

# Optional API Key
VITE_API_KEY=your_api_key_here
```

### API Client (`/lib/api.ts`)

The frontend includes a complete API client with helper functions for:
- **Authentication**: Sign up, sign in, sign out, session management
- **Student Operations**: Progress tracking, activities, quiz results, achievements
- **Teacher Operations**: Class management, student analytics, assignment creation
- **Assignments**: Create, retrieve, and manage assignments/notices

## Backend Requirements

### Django Models (MongoDB Schemas)

Your Django backend should implement the following collections:

#### 1. User Profile
```python
{
  "_id": ObjectId,
  "email": str,
  "name": str,
  "role": "student" | "teacher",
  "grade": str | None,  # For students only
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 2. Student Progress
```python
{
  "_id": ObjectId,
  "user_id": str,
  "subject": "math" | "science" | "technology" | "engineering",
  "activities_completed": int,
  "total_activities": int,
  "points": int,
  "badges": [str],
  "current_level": int,
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 3. Class
```python
{
  "_id": ObjectId,
  "teacher_id": str,
  "class_name": str,
  "grade": str,
  "subject": str | None,
  "description": str | None,
  "student_count": int,
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 4. Activity
```python
{
  "_id": ObjectId,
  "subject": "math" | "science" | "technology" | "engineering",
  "title": str,
  "description": str | None,
  "grade_level": str,
  "activity_type": "quiz" | "game" | "challenge" | "experiment",
  "difficulty": "easy" | "medium" | "hard",
  "points_reward": int,
  "estimated_time_minutes": int | None,
  "content": dict,  # JSON content for the activity
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 5. Quiz Result
```python
{
  "_id": ObjectId,
  "user_id": str,
  "activity_id": str,
  "score": int,
  "max_score": int,
  "time_taken_seconds": int | None,
  "answers": dict,  # JSON with question/answer data
  "points_earned": int,
  "completed_at": datetime
}
```

#### 6. Achievement
```python
{
  "_id": ObjectId,
  "user_id": str,
  "achievement_type": "badge" | "trophy" | "certificate" | "streak",
  "achievement_name": str,
  "achievement_icon": str | None,
  "subject": str | None,
  "earned_at": datetime
}
```

#### 7. Assignment/Notice
```python
{
  "_id": ObjectId,
  "teacher_id": str,
  "title": str,
  "type": "assignment" | "notice",
  "subject": str,
  "target_grade": str,
  "content": str,
  "attachment": {
    "name": str,
    "type": str,
    "data": str  # Base64 encoded file
  } | None,
  "teacher_name": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Required API Endpoints

#### Authentication Endpoints

```
POST   /api/auth/signup/     - Create new user account
POST   /api/auth/login/      - Authenticate user
POST   /api/auth/logout/     - End user session
GET    /api/auth/session/    - Get current session
GET    /api/users/:id/       - Get user profile
```

#### Student Endpoints

```
GET    /api/students/:userId/progress/              - Get all progress
PATCH  /api/students/:userId/progress/:subject/     - Update progress
GET    /api/activities/?grade=:grade&subject=:subject - Get activities
POST   /api/quiz-results/                           - Submit quiz result
GET    /api/students/:userId/achievements/          - Get achievements
GET    /api/assignments/?grade=:grade               - Get assignments for grade
POST   /api/assignments/:id/view/                   - Mark as viewed
```

#### Teacher Endpoints

```
GET    /api/teachers/:teacherId/classes/            - Get teacher's classes
POST   /api/classes/                                - Create new class
GET    /api/classes/:classId/students/              - Get class students
GET    /api/teachers/:teacherId/analytics/          - Get class analytics
POST   /api/assignments/                            - Create assignment/notice
GET    /api/teachers/:teacherId/assignments/        - Get teacher's assignments
DELETE /api/assignments/:id/                        - Delete assignment
```

### Django Settings

#### CORS Configuration
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

# Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
]

# Production
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

#### Session Configuration
```python
# Use secure sessions for production
SESSION_COOKIE_SECURE = True  # HTTPS only
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
```

#### MongoDB Configuration (using djongo)
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'stem_learning_db',
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'mongodb://localhost:27017/',
            # Add authentication if needed
        }
    }
}
```

## Testing the Connection

### Check if API is configured
```javascript
import { isApiConfigured } from './lib/api';

if (isApiConfigured) {
  console.log('Connected to Django backend');
} else {
  console.log('Running in DEMO MODE');
}
```

### Test Authentication
```javascript
import { authHelpers } from './lib/api';

// Sign up
const { user, error } = await authHelpers.signUp(
  'student@example.com',
  'password123',
  {
    name: 'Test Student',
    role: 'student',
    grade: '8'
  }
);

// Sign in
const { user, profile } = await authHelpers.signIn(
  'student@example.com',
  'password123'
);
```

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **CSRF Protection**: Enable Django CSRF protection
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **Input Validation**: Validate all inputs on backend
5. **Authentication**: Use secure session-based authentication
6. **API Keys**: Optional API key for additional security layer
7. **PII Data**: Platform is designed for educational use - avoid collecting sensitive personal information

## Deployment Checklist

- [ ] Django backend deployed and accessible
- [ ] MongoDB database configured and running
- [ ] CORS properly configured
- [ ] Environment variables set in frontend
- [ ] SSL/TLS certificates installed
- [ ] API endpoints tested
- [ ] Authentication flow verified
- [ ] Error handling tested
- [ ] Rate limiting configured
- [ ] Monitoring and logging enabled

## Support

For issues or questions about the API integration:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test API endpoints using tools like Postman
4. Review Django logs for backend errors
5. Ensure MongoDB is accessible and running

## Development Workflow

1. Start Django backend: `python manage.py runserver`
2. Start MongoDB: `mongod`
3. Start frontend: `npm run dev`
4. Access application: `http://localhost:5173`

The frontend will automatically detect if the backend is available and switch between DEMO MODE and PRODUCTION MODE accordingly.
