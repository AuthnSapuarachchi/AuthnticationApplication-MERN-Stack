# 🚀 Quick Start Guide - Testing Refresh Token System

## ✅ Prerequisites Completed
- User model updated with `refreshTokens` and `role` fields
- JWT_REFRESH_SECRET added to .env
- All controllers updated
- Routes configured
- Middleware created

---

## 🧪 Step-by-Step Testing

### Step 1: Start Your Server
```bash
cd server
npm run server
```

### Step 2: Register a New User
**Using Thunder Client, Postman, or curl:**

```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
- Status: 201
- Body: `{ "success": true, "message": "User registered successfully" }`
- Cookies: `token` and `refreshToken` set automatically

### Step 3: Check Your Cookies
In Thunder Client/Postman, check the "Cookies" tab. You should see:
- `token` (expires in 15 minutes)
- `refreshToken` (expires in 7 days)

### Step 4: Test Protected Route
```bash
GET http://localhost:4000/api/user/data
```
Cookies are sent automatically!

**Expected Response:**
```json
{
  "success": true,
  "userData": {
    "name": "John Doe",
    "isAccountVerified": false
  }
}
```

### Step 5: Test Refresh Token Endpoint
```bash
POST http://localhost:4000/api/auth/refresh-token
```

**Expected Response:**
- Status: 200
- New `token` and `refreshToken` cookies
- Body: `{ "success": true, "message": "Token refreshed successfully" }`

### Step 6: Test Role-Based Access Control

**First, update user to admin in MongoDB:**
```javascript
// In MongoDB Compass or Shell
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "admin" } }
)
```

**Then test admin route:**
```bash
GET http://localhost:4000/api/user/admin-data
```

**Expected Response (if admin):**
```json
{
  "success": true,
  "message": "Admin data access granted",
  "timestamp": "2025-10-09T..."
}
```

**Expected Response (if not admin):**
```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions"
}
```

### Step 7: Test Logout
```bash
POST http://localhost:4000/api/auth/logout
```

**Expected:**
- Status: 200
- Cookies cleared
- Refresh token removed from database

### Step 8: Try Accessing Protected Route After Logout
```bash
GET http://localhost:4000/api/user/data
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Unauthorized. Login Again"
}
```

---

## 🔍 Verify in MongoDB

After registration/login, check your database:

```javascript
// Find user and see refreshTokens array
db.users.findOne({ email: "john@example.com" })
```

You should see:
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",
  "role": "user",
  "refreshTokens": [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ],
  "isAccountVerified": false,
  ...
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No refresh token provided"
**Solution:** Make sure cookies are enabled in your API client (Thunder Client/Postman)

### Issue 2: "Invalid refresh token"
**Solution:** The refresh token might have expired or been removed. Login again.

### Issue 3: "Forbidden: Insufficient permissions"
**Solution:** Update user role in MongoDB to 'admin' or 'moderator'

### Issue 4: Access token expired
**Solution:** Call `/api/auth/refresh-token` to get a new access token

---

## 📱 Frontend Integration (React)

### Create an Axios Interceptor:

```javascript
// src/utils/axiosInterceptor.js
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If access token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await axios.post('/api/auth/refresh-token');
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Use in AppContext:

```javascript
// Import the interceptor in main.jsx or App.jsx
import './utils/axiosInterceptor';
```

---

## 🎉 Success Indicators

✅ You can register and login
✅ Cookies are set automatically
✅ Protected routes work with valid token
✅ Refresh token endpoint generates new tokens
✅ Admin routes return 403 for non-admin users
✅ Logout removes tokens and clears cookies
✅ Multiple logins create multiple refresh tokens in DB

---

## 📝 Next Feature to Implement

**Two-Factor Authentication (2FA)**
- Google Authenticator integration
- QR code generation
- Backup codes
- 2FA management page

Let me know when you're ready! 🚀
