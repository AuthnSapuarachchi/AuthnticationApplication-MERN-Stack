# 🏗️ System Architecture

## 📊 Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        MERN Authentication System                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────┐
│                      │      │                      │      │              │
│   React Frontend     │◄────►│   Express Backend    │◄────►│   MongoDB    │
│   (Port 5174)        │      │   (Port 4000)        │      │   Database   │
│                      │      │                      │      │              │
└──────────────────────┘      └──────────────────────┘      └──────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│                      │      │                      │
│  Google Authenticator│      │   Email Service      │
│  (Mobile App)        │      │   (Nodemailer)       │
│                      │      │                      │
└──────────────────────┘      └──────────────────────┘
```

---

## 🎯 Frontend Architecture

```
client/
│
├── src/
│   │
│   ├── pages/                      # React Pages
│   │   ├── Home.jsx               # Landing page
│   │   ├── Login.jsx              # Login/Signup
│   │   ├── EmailVerify.jsx        # Email verification
│   │   ├── ResetPassword.jsx      # Password reset
│   │   ├── Settings.jsx           # ✨ User settings + 2FA management
│   │   ├── TwoFactorSetup.jsx     # ✨ 2FA setup wizard (3 steps)
│   │   ├── TwoFactorVerify.jsx    # ✨ 2FA login verification
│   │   └── AdminDashboard.jsx     # ✨ Admin/Moderator dashboard
│   │
│   ├── components/                 # React Components
│   │   ├── Header.jsx             # Home header with buttons
│   │   └── NavBar.jsx             # Navigation with dropdown
│   │
│   ├── context/                    # State Management
│   │   ├── AppContext.jsx         # Global state + token refresh
│   │   └── AppContextDefinition.jsx
│   │
│   ├── assets/                     # Images and resources
│   │
│   ├── App.jsx                     # Main app with routes
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
│
└── package.json
```

---

## 🔧 Backend Architecture

```
server/
│
├── controllers/                    # Business Logic
│   ├── authController.js          # Authentication logic
│   │   ├── register()
│   │   ├── login()                # ✨ Added 2FA check
│   │   ├── logout()
│   │   ├── refreshToken()         # ✨ Token refresh
│   │   ├── sendVerifyOtp()
│   │   ├── verifyEmail()
│   │   ├── sendResetOtp()
│   │   ├── resetPassword()
│   │   └── isAuthenticated()
│   │
│   ├── userController.js          # User operations
│   │   ├── getUserData()
│   │   ├── getAdminData()         # ✨ Admin only
│   │   └── getModeratorData()     # ✨ Admin/Mod only
│   │
│   └── twoFactorController.js     # ✨ 2FA Management
│       ├── setup2FA()             # Generate QR + secret
│       ├── verify2FA()            # Verify code + enable
│       ├── disable2FA()           # Disable with password
│       ├── verifyLoginToken()     # Login verification
│       ├── get2FAStatus()         # Check status
│       └── regenerateBackupCodes()# New backup codes
│
├── routes/                         # API Routes
│   ├── authRoutes.js              # /api/auth/*
│   ├── userRoutes.js              # /api/user/*
│   └── twoFactorRoutes.js         # ✨ /api/2fa/*
│
├── middleware/                     # Middleware
│   ├── userAuth.js                # JWT verification
│   └── roleAuth.js                # ✨ Role checking
│
├── model/                          # Database Models
│   └── usermodel.js               # User schema
│       ├── Basic fields (name, email, password)
│       ├── Verification fields (OTP, expiry)
│       ├── role                   # ✨ user/admin/moderator
│       ├── refreshTokens[]        # ✨ Token storage
│       ├── twoFactorSecret        # ✨ TOTP secret
│       ├── twoFactorEnabled       # ✨ 2FA status
│       └── backupCodes[]          # ✨ Recovery codes
│
├── config/                         # Configuration
│   ├── mongodb.js                 # DB connection
│   ├── nodemailer.js              # Email config
│   └── nodemailer-alternative.js
│
├── server.js                       # Entry point
├── package.json
└── .env                            # Environment variables
```

---

## 🔐 Authentication Flow

### Registration Flow
```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│         │     │         │     │          │     │          │
│ Client  │────►│ POST    │────►│ Hash     │────►│ MongoDB  │
│         │     │/register│     │ Password │     │          │
│         │     │         │     │          │     │          │
└─────────┘     └─────────┘     └──────────┘     └──────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │ Generate Tokens  │
                            │ - Access (15min) │
                            │ - Refresh (7d)   │
                            └──────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │ Set HTTP-only    │
                            │ Cookies          │
                            └──────────────────┘
```

### Login Flow (Without 2FA)
```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│         │     │         │     │          │     │          │
│ Client  │────►│ POST    │────►│ Verify   │────►│ Check    │
│         │     │ /login  │     │ Password │     │ 2FA      │
│         │     │         │     │          │     │ Status   │
└─────────┘     └─────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │ 2FA Disabled?    │
                                              └──────────────────┘
                                                        │
                                                   YES  │
                                                        ▼
                                              ┌──────────────────┐
                                              │ Generate Tokens  │
                                              │ Return Success   │
                                              └──────────────────┘
```

### Login Flow (With 2FA) ✨
```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│         │     │         │     │          │     │          │
│ Client  │────►│ POST    │────►│ Verify   │────►│ Check    │
│         │     │ /login  │     │ Password │     │ 2FA      │
│         │     │         │     │          │     │ Status   │
└─────────┘     └─────────┘     └──────────┘     └──────────┘
     │                                                  │
     │                                             YES  │
     │                                                  ▼
     │                                        ┌──────────────────┐
     │                                        │ Return:          │
     │                                        │ requires2FA:true │
     │                                        │ tempToken        │
     │                                        └──────────────────┘
     │                                                  │
     │                                                  ▼
     │                                        ┌──────────────────┐
     │◄───────────────────────────────────────│ Navigate to      │
     │                                        │ 2FA Verify Page  │
     │                                        └──────────────────┘
     │
     ▼
┌──────────────────┐
│ Enter 6-digit    │
│ Code or Backup   │
└──────────────────┘
     │
     ▼
┌──────────────────┐
│ POST             │
│ /2fa/verify-login│
└──────────────────┘
     │
     ▼
┌──────────────────┐
│ Verify Code      │
│ Issue Tokens     │
│ Full Access ✓    │
└──────────────────┘
```

---

## 🔄 Token Refresh Flow ✨

```
┌─────────────────────────────────────────────────────────────┐
│                     Automatic Token Refresh                  │
└─────────────────────────────────────────────────────────────┘

Time: 0 min
┌─────────┐
│ Login   │
│ Success │
└─────────┘
     │
     ▼
┌─────────────────┐
│ Access Token    │───────── Expires in 15 minutes
│ (15 min)        │
└─────────────────┘
┌─────────────────┐
│ Refresh Token   │───────── Expires in 7 days
│ (7 days)        │
└─────────────────┘

Time: 15 min (Access token expired)
┌─────────────────┐
│ API Request     │
│ 401 Error       │
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Axios           │
│ Interceptor     │
│ Catches Error   │
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ POST            │
│ /refresh-token  │
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Backend:        │
│ 1. Verify       │
│    refresh token│
│ 2. Generate NEW │
│    access token │
│ 3. Generate NEW │
│    refresh token│
│ 4. Delete OLD   │
│    refresh token│
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Retry Original  │
│ Request         │
│ Success! ✓      │
└─────────────────┘
```

---

## 🎯 Role-Based Access Control ✨

```
┌─────────────────────────────────────────────────────────────┐
│                       RBAC Hierarchy                         │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │    ADMIN    │
                    │  (Highest)  │
                    └─────────────┘
                          │
                          │ Can access everything below
                          │
                          ▼
                    ┌─────────────┐
                    │  MODERATOR  │
                    │  (Medium)   │
                    └─────────────┘
                          │
                          │ Can access everything below
                          │
                          ▼
                    ┌─────────────┐
                    │    USER     │
                    │   (Basic)   │
                    └─────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    Permission Matrix                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Resource                  │ User │ Moderator │ Admin │      │
│──────────────────────────│──────│───────────│───────│      │
│ Home Page                 │  ✓   │     ✓     │   ✓   │      │
│ Settings                  │  ✓   │     ✓     │   ✓   │      │
│ /api/user/data            │  ✓   │     ✓     │   ✓   │      │
│ Moderator Dashboard       │  ✗   │     ✓     │   ✓   │      │
│ /api/user/moderator-data  │  ✗   │     ✓     │   ✓   │      │
│ Admin Dashboard           │  ✗   │     ✗     │   ✓   │      │
│ /api/user/admin-data      │  ✗   │     ✗     │   ✓   │      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Two-Factor Authentication Flow ✨

### Setup Flow
```
┌─────────────────────────────────────────────────────────────┐
│                     2FA Setup Wizard                         │
└─────────────────────────────────────────────────────────────┘

STEP 1: Generate Secret
┌─────────────┐
│ Click       │
│ Enable 2FA  │
└─────────────┘
      │
      ▼
┌─────────────┐     ┌──────────────┐
│ POST        │────►│ Backend:     │
│ /2fa/setup  │     │ 1. Generate  │
│             │     │    TOTP      │
│             │     │    secret    │
│             │     │ 2. Create QR │
│             │     │ 3. Generate  │
│             │     │    10 backup │
│             │     │    codes     │
└─────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Return:      │
                    │ - QR code    │
                    │ - Secret     │
                    └──────────────┘

STEP 2: Verify Code
┌─────────────┐
│ Scan QR with│
│ Google Auth │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Enter       │
│ 6-digit code│
└─────────────┘
      │
      ▼
┌─────────────┐     ┌──────────────┐
│ POST        │────►│ Backend:     │
│ /2fa/verify │     │ 1. Verify    │
│             │     │    code      │
│             │     │ 2. Enable 2FA│
│             │     │ 3. Save to DB│
└─────────────┘     └──────────────┘

STEP 3: Save Backup Codes
┌─────────────┐
│ Display     │
│ 10 codes    │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Download    │
│ codes.txt   │
└─────────────┘
      │
      ▼
┌─────────────┐
│ 2FA Enabled │
│ ✓ Complete  │
└─────────────┘
```

### Login Verification Flow
```
┌─────────────────────────────────────────────────────────────┐
│               2FA Login Verification                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐
│ User enters │
│ credentials │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Backend     │
│ checks if   │
│ 2FA enabled │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Redirect to │
│ 2FA Verify  │
│ Page        │
└─────────────┘
      │
      ▼
┌─────────────────────────────┐
│ User has 2 options:         │
│                             │
│ Option A: Authenticator Code│
│ ┌─────────────┐            │
│ │ Enter       │            │
│ │ 6-digit code│            │
│ └─────────────┘            │
│                             │
│ Option B: Backup Code       │
│ ┌─────────────┐            │
│ │ Enter       │            │
│ │ 8-char code │            │
│ └─────────────┘            │
└─────────────────────────────┘
      │
      ▼
┌─────────────┐     ┌──────────────┐
│ POST        │────►│ Backend:     │
│ /2fa/verify-│     │ 1. Verify    │
│ login       │     │    TOTP or   │
│             │     │    backup    │
│             │     │ 2. Mark code │
│             │     │    as used   │
│             │     │ 3. Issue     │
│             │     │    tokens    │
└─────────────┘     └──────────────┘
      │
      ▼
┌─────────────┐
│ Logged in   │
│ ✓ Success   │
└─────────────┘
```

---

## 💾 Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                      User Collection                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  {                                                           │
│    _id: ObjectId,                                           │
│                                                              │
│    // Basic Information                                     │
│    name: String,                                            │
│    email: String (unique, indexed),                         │
│    password: String (hashed with bcrypt),                   │
│                                                              │
│    // Email Verification                                    │
│    verifyOtp: String,                                       │
│    verifyOtpExpireAt: Number,                               │
│    isAccountVerified: Boolean,                              │
│                                                              │
│    // Password Reset                                        │
│    resetOtp: String,                                        │
│    resetOtpExpireAt: Number,                                │
│                                                              │
│    // ✨ Role-Based Access Control                         │
│    role: {                                                  │
│      type: String,                                          │
│      enum: ['user', 'admin', 'moderator'],                  │
│      default: 'user'                                        │
│    },                                                       │
│                                                              │
│    // ✨ Refresh Token System                              │
│    refreshTokens: [{                                        │
│      token: String,                                         │
│      createdAt: Date                                        │
│    }],                                                      │
│                                                              │
│    // ✨ Two-Factor Authentication                         │
│    twoFactorSecret: String,                                 │
│    twoFactorEnabled: Boolean (default: false),              │
│    backupCodes: [String],                                   │
│                                                              │
│    // Timestamps                                            │
│    createdAt: Date,                                         │
│    updatedAt: Date                                          │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 API Endpoints Map

```
/api
│
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh-token         ✨ NEW
│   ├── POST   /send-verify-otp
│   ├── POST   /verify-account
│   ├── POST   /send-reset-otp
│   ├── POST   /reset-password
│   └── GET    /is-auth
│
├── /user
│   ├── GET    /data                  [userAuth]
│   ├── GET    /admin-data            [userAuth, roleAuth('admin')] ✨
│   └── GET    /moderator-data        [userAuth, roleAuth(['admin','moderator'])] ✨
│
└── /2fa                               ✨ NEW
    ├── POST   /setup                 [userAuth]
    ├── POST   /verify                [userAuth]
    ├── POST   /disable               [userAuth]
    ├── POST   /verify-login          [tempAuth]
    ├── GET    /status                [userAuth]
    └── POST   /regenerate-codes      [userAuth]
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Architecture                     │
└─────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
┌─────────────────────────────────────────┐
│ HTTPS (in production)                   │
│ Secure WebSocket connections            │
└─────────────────────────────────────────┘

Layer 2: Authentication
┌─────────────────────────────────────────┐
│ JWT Tokens (Access + Refresh)           │
│ HTTP-only Cookies                       │
│ Token Expiration                        │
│ Token Rotation                          │
└─────────────────────────────────────────┘

Layer 3: Two-Factor Authentication
┌─────────────────────────────────────────┐
│ TOTP (Time-based One-Time Password)     │
│ Google Authenticator compatible         │
│ Backup codes (one-time use)             │
│ 30-second code expiry                   │
└─────────────────────────────────────────┘

Layer 4: Authorization
┌─────────────────────────────────────────┐
│ Role-Based Access Control               │
│ Permission middleware                   │
│ Route protection                        │
└─────────────────────────────────────────┘

Layer 5: Data Protection
┌─────────────────────────────────────────┐
│ Password hashing (bcrypt)               │
│ Secret encryption                       │
│ Secure session storage                  │
└─────────────────────────────────────────┘

Layer 6: Input Validation
┌─────────────────────────────────────────┐
│ Email format validation                 │
│ Password strength requirements          │
│ OTP format validation                   │
│ XSS prevention                          │
└─────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│            Complete Data Flow (with 2FA)                     │
└─────────────────────────────────────────────────────────────┘

User Action → Frontend → Backend → Database → Response

Example: Login with 2FA

1. User enters credentials
   │
   ▼
2. React Login.jsx
   │
   ▼
3. POST /api/auth/login
   │
   ▼
4. authController.login()
   │
   ├──► Check email/password
   │
   ├──► Check if 2FA enabled
   │
   └──► Return { requires2FA: true, tempToken }
   │
   ▼
5. Frontend redirects to /2fa-verify
   │
   ▼
6. User enters 6-digit code
   │
   ▼
7. POST /api/2fa/verify-login
   │
   ▼
8. twoFactorController.verifyLoginToken()
   │
   ├──► Verify TOTP code
   │
   ├──► Generate access + refresh tokens
   │
   └──► Return { success: true, tokens }
   │
   ▼
9. Frontend sets tokens in cookies
   │
   ▼
10. Navigate to home page
    │
    ▼
11. User is fully authenticated ✓
```

---

## 🎯 Component Interaction Map

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend Component Hierarchy                    │
└─────────────────────────────────────────────────────────────┘

App.jsx
│
├── AppContextProvider (Global State)
│   │
│   ├── isLoggedIn
│   ├── userData
│   ├── getUserData()
│   └── Token Refresh Interceptor
│
├── Routes
│   │
│   ├── Home
│   │   ├── NavBar
│   │   └── Header
│   │
│   ├── Login
│   │
│   ├── Settings
│   │   └── NavBar
│   │
│   ├── TwoFactorSetup
│   │   ├── Step 1: QR Display
│   │   ├── Step 2: Code Verify
│   │   └── Step 3: Backup Codes
│   │
│   ├── TwoFactorVerify
│   │   ├── 6-digit Input
│   │   └── Backup Code Input
│   │
│   └── AdminDashboard
│       ├── NavBar
│       ├── Admin Section (admin only)
│       └── Moderator Section (admin + mod)
│
└── ToastContainer (Notifications)
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Production Deployment (Recommended)           │
└─────────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
┌─────────────────────┐
│  React App (Static) │
│  - Vite Build       │
│  - CDN Delivery     │
│  - HTTPS            │
└─────────────────────┘
         │
         │ API Calls
         ▼
Backend (Railway/Heroku/AWS)
┌─────────────────────┐
│  Node.js Server     │
│  - Express API      │
│  - JWT Auth         │
│  - CORS Enabled     │
└─────────────────────┘
         │
         │ Database Queries
         ▼
Database (MongoDB Atlas)
┌─────────────────────┐
│  MongoDB Cloud      │
│  - Replicated       │
│  - Encrypted        │
│  - Backed Up        │
└─────────────────────┘

Email Service (Brevo/SendGrid)
┌─────────────────────┐
│  SMTP Service       │
│  - OTP Emails       │
│  - Notifications    │
└─────────────────────┘
```

---

**📐 This architecture supports:**
- ✅ Scalability (horizontal scaling)
- ✅ Security (multiple layers)
- ✅ Maintainability (clean separation)
- ✅ Performance (optimized flows)
- ✅ Reliability (error handling)

---

🎉 **Professional Architecture!** 🎉
