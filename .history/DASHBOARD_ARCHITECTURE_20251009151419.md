# Role-Based Dashboard System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MERN AUTHENTICATION APPLICATION                      │
│                      WITH ROLE-BASED DASHBOARD SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐     ┌────────────────────┐     ┌─────────────────┐ │
│  │   UserDashboard    │     │  AdminDashboard    │     │     NavBar      │ │
│  │   /dashboard       │     │ /admin-dashboard   │     │  (Navigation)   │ │
│  ├────────────────────┤     ├────────────────────┤     ├─────────────────┤ │
│  │ - Profile Info     │     │ Admin View:        │     │ - Dashboard     │ │
│  │ - Security Stats   │     │  • System Stats    │     │ - Admin/Mod     │ │
│  │ - Activity Log     │     │  • User Table      │     │ - Settings      │ │
│  │ - Recommendations  │     │  • Health Monitor  │     │ - Logout        │ │
│  │                    │     │                    │     └─────────────────┘ │
│  │ 4 Stat Cards:      │     │ Moderator View:    │                         │
│  │ • Account Status   │     │  • Moderation      │                         │
│  │ • Security Level   │     │  • Tasks           │                         │
│  │ • Backup Codes     │     │  • Recent Users    │                         │
│  │ • Active Sessions  │     │                    │                         │
│  └────────────────────┘     └────────────────────┘                         │
│                                                                              │
│  Components Used:                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  StatCard    │  │ ActivityItem │  │ DashboardCard│  │  InfoItem    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP Requests (axios)
                                      │ JWT Token in Headers
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MIDDLEWARE LAYER (Express)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐              ┌─────────────────────┐              │
│  │     userAuth        │              │     roleAuth        │              │
│  ├─────────────────────┤              ├─────────────────────┤              │
│  │ • Verify JWT Token  │   ────────>  │ • Check User Role   │              │
│  │ • Extract userId    │              │ • Validate Access   │              │
│  │ • Add to req.body   │              │ • Return 403 if no  │              │
│  └─────────────────────┘              └─────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROUTES (Express Router)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GET /api/user/dashboard/user                                               │
│  ├─ Middleware: userAuth                                                    │
│  └─ Handler: getUserDashboard()                                             │
│                                                                              │
│  GET /api/user/dashboard/moderator                                          │
│  ├─ Middleware: userAuth → roleAuth(['admin', 'moderator'])                │
│  └─ Handler: getModeratorDashboard()                                        │
│                                                                              │
│  GET /api/user/dashboard/admin                                              │
│  ├─ Middleware: userAuth → roleAuth('admin')                                │
│  └─ Handler: getAdminDashboard()                                            │
│                                                                              │
│  GET /api/user/all-users                                                    │
│  ├─ Middleware: userAuth → roleAuth('admin')                                │
│  └─ Handler: getAllUsers()                                                  │
│                                                                              │
│  PUT /api/user/update-role                                                  │
│  ├─ Middleware: userAuth → roleAuth('admin')                                │
│  └─ Handler: updateUserRole()                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTROLLERS (Business Logic)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ getUserDashboard()                                                     │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ 1. Find user by userId                                                │ │
│  │ 2. Calculate account age                                              │ │
│  │ 3. Count backup codes                                                 │ │
│  │ 4. Return user info, stats, and activity                             │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ getModeratorDashboard()                                                │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ 1. Find moderator user                                                │ │
│  │ 2. Count total users, verified, 2FA enabled                          │ │
│  │ 3. Fetch recent users (last 10)                                       │ │
│  │ 4. Return moderation stats and tasks                                  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ getAdminDashboard()                                                    │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ 1. Find admin user                                                    │ │
│  │ 2. Aggregate user statistics:                                         │ │
│  │    • Total users, verified, 2FA                                       │ │
│  │    • Users by role (admin/moderator/user)                            │ │
│  │    • New users last 30 days                                           │ │
│  │ 3. Calculate percentages                                              │ │
│  │ 4. Fetch recent users with full details                              │ │
│  │ 5. Return comprehensive dashboard data                                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ getAllUsers()                                                          │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ 1. Find all users (exclude sensitive fields)                         │ │
│  │ 2. Sort by creation date (newest first)                              │ │
│  │ 3. Return user array with count                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ updateUserRole()                                                       │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ 1. Validate targetUserId and newRole                                  │ │
│  │ 2. Verify role is valid (user/moderator/admin)                       │ │
│  │ 3. Update user role in database                                       │ │
│  │ 4. Return updated user data                                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MongoDB)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ userModel (Mongoose Schema)                                            │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ Fields:                                                                │ │
│  │ • name                    (String)                                     │ │
│  │ • email                   (String, unique)                            │ │
│  │ • password                (String, hashed)                            │ │
│  │ • role                    (String: user/moderator/admin)              │ │
│  │ • isAccountVerified       (Boolean)                                   │ │
│  │ • twoFactorEnabled        (Boolean)                                   │ │
│  │ • twoFactorSecret         (String)                                    │ │
│  │ • backupCodes             (Array)                                     │ │
│  │ • refreshTokens           (Array)                                     │ │
│  │ • verifyOtp               (String)                                    │ │
│  │ • verifyOtpExpireAt       (Date)                                      │ │
│  │ • resetOtp                (String)                                    │ │
│  │ • resetOtpExpireAt        (Date)                                      │ │
│  │ • createdAt               (Date)                                      │ │
│  │ • updatedAt               (Date)                                      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Queries Used:                                                              │
│  • countDocuments() - Count total/filtered users                           │
│  • find() - Fetch users with filters                                       │
│  • findById() - Get specific user                                          │
│  • findByIdAndUpdate() - Update user data                                  │
│  • aggregate() - Group users by role                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                        ROLE-BASED ACCESS MATRIX                              │
├──────────────────┬──────────────┬──────────────┬──────────────────────────┤
│ Endpoint         │ User (role:  │ Moderator    │ Admin (role: admin)     │
│                  │ user)        │ (role:mod)   │                         │
├──────────────────┼──────────────┼──────────────┼──────────────────────────┤
│ /dashboard/user  │ ✅ Access    │ ✅ Access    │ ✅ Access               │
│                  │              │              │                         │
│ /dashboard/      │ ❌ Forbidden │ ✅ Access    │ ✅ Access               │
│ moderator        │              │              │                         │
│                  │              │              │                         │
│ /dashboard/admin │ ❌ Forbidden │ ❌ Forbidden │ ✅ Access               │
│                  │              │              │                         │
│ /all-users       │ ❌ Forbidden │ ❌ Forbidden │ ✅ Access               │
│                  │              │              │                         │
│ /update-role     │ ❌ Forbidden │ ❌ Forbidden │ ✅ Access               │
└──────────────────┴──────────────┴──────────────┴──────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────────────┘

USER DASHBOARD FLOW:
═══════════════════

User Login → Click "Dashboard" → UserDashboard.jsx
                                        │
                                        ├─> axios.get('/api/user/dashboard/user')
                                        │   + JWT Token
                                        ▼
                                  userAuth middleware
                                        │
                                        ├─> Verify JWT
                                        ├─> Extract userId
                                        ▼
                                  getUserDashboard()
                                        │
                                        ├─> Find user by ID
                                        ├─> Calculate account age
                                        ├─> Count backup codes
                                        ├─> Count active sessions
                                        ▼
                                  MongoDB Query
                                        │
                                        ▼
                                  Return JSON:
                                  {
                                    user: { name, email, role, ... },
                                    stats: { accountStatus, securityLevel, ... },
                                    recentActivity: { lastLogin, ... }
                                  }
                                        │
                                        ▼
                                  UserDashboard displays:
                                  • Profile Card
                                  • 4 Stat Cards
                                  • Activity Timeline
                                  • Security Recommendations


ADMIN DASHBOARD FLOW:
════════════════════

Admin Login → Click "Admin Dashboard" → AdminDashboard.jsx
                                              │
                                              ├─> axios.get('/api/user/dashboard/admin')
                                              │   + JWT Token
                                              ▼
                                        userAuth middleware
                                              │
                                              ├─> Verify JWT
                                              ├─> Extract userId & role
                                              ▼
                                        roleAuth('admin')
                                              │
                                              ├─> Check if role === 'admin'
                                              ├─> 403 if not admin
                                              ▼
                                        getAdminDashboard()
                                              │
                                              ├─> Multiple MongoDB Queries:
                                              │   • countDocuments() - total users
                                              │   • countDocuments({verified})
                                              │   • countDocuments({2FA enabled})
                                              │   • countDocuments({role: 'admin'})
                                              │   • countDocuments({role: 'moderator'})
                                              │   • aggregate() - users by role
                                              │   • find().sort().limit() - recent users
                                              ▼
                                        Calculate Percentages:
                                              │
                                              ├─> Verification Rate %
                                              ├─> 2FA Adoption Rate %
                                              ▼
                                        Return JSON:
                                        {
                                          admin: { name, permissions },
                                          overview: { totalUsers, verified, 2FA, ... },
                                          userDistribution: { admins, moderators, ... },
                                          security: { ... },
                                          recentUsers: [...],
                                          systemHealth: { ... }
                                        }
                                              │
                                              ▼
                                        AdminDashboard displays:
                                        • 6 Overview Cards
                                        • System Health Section
                                        • Recent Users Table
                                        • Moderation Tools
                                        • Permissions List


┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

App.jsx
 │
 ├── Route: /
 │   └── Home.jsx
 │       └── NavBar.jsx
 │
 ├── Route: /dashboard
 │   └── UserDashboard.jsx
 │       ├── NavBar.jsx
 │       ├── StatCard (x4)
 │       │   └── Icon, Title, Value, Subtitle
 │       ├── ActivityItem (x3)
 │       │   └── Icon, Label, Value
 │       └── Security Recommendations
 │           └── Conditional Alerts + Actions
 │
 ├── Route: /admin-dashboard
 │   └── AdminDashboard.jsx
 │       ├── NavBar.jsx
 │       ├── Admin View (if role === 'admin')
 │       │   ├── DashboardCard (x6)
 │       │   │   └── Icon, Title, Value, Subtitle
 │       │   ├── System Health Section
 │       │   │   └── InfoItem (x4)
 │       │   └── Recent Users Table
 │       │       └── Table Rows (x5)
 │       ├── Moderator View (if role === 'moderator' or 'admin')
 │       │   ├── DashboardCard (x3)
 │       │   ├── Recent Users List
 │       │   │   └── User Cards (x5)
 │       │   └── Active Tasks
 │       │       └── InfoItem (x3)
 │       └── Permissions Section
 │           └── Permission List
 │
 └── Route: /login, /settings, etc.
     └── Other Pages...


┌─────────────────────────────────────────────────────────────────────────────┐
│                       STATISTICS CALCULATION                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Total Users:
─────────────
MongoDB: db.users.countDocuments({})
Example: 1234 users

Verified Users:
───────────────
MongoDB: db.users.countDocuments({ isAccountVerified: true })
Example: 1100 verified
Calculation: (1100 / 1234) * 100 = 89.2% verification rate

Users with 2FA:
───────────────
MongoDB: db.users.countDocuments({ twoFactorEnabled: true })
Example: 980 users
Calculation: (980 / 1234) * 100 = 79.4% adoption rate

New Users (Last 30 Days):
─────────────────────────
MongoDB: db.users.countDocuments({
  createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})
Example: 45 new users

Users by Role:
──────────────
MongoDB Aggregation:
db.users.aggregate([
  {
    $group: {
      _id: '$role',
      count: { $sum: 1 }
    }
  }
])
Result:
  • Admins: 3
  • Moderators: 10
  • Regular Users: 1221

Recent Users:
─────────────
MongoDB: db.users.find()
  .select('name email role createdAt isAccountVerified twoFactorEnabled')
  .sort({ createdAt: -1 })
  .limit(10)


┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────┘

Request Flow with Security Checks:

1. User Makes Request
   └─> GET /api/user/dashboard/admin
       Headers: { Authorization: "Bearer <JWT>" }

2. userAuth Middleware
   ├─> Extract token from headers
   ├─> Verify JWT signature
   ├─> Check expiration
   ├─> Decode payload { userId, role }
   ├─> Add to req.body
   └─> ✅ Pass to next middleware / ❌ Return 401

3. roleAuth Middleware
   ├─> Check req.body.role
   ├─> Compare with required role(s)
   └─> ✅ Pass to controller / ❌ Return 403

4. Controller Function
   ├─> Execute business logic
   ├─> Query database
   ├─> Exclude sensitive fields
   └─> Return data

5. Response to Client
   └─> JSON with dashboard data


┌─────────────────────────────────────────────────────────────────────────────┐
│                    FILE STRUCTURE OVERVIEW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

project-root/
│
├── server/
│   ├── controllers/
│   │   ├── authController.js         [AUTH LOGIC]
│   │   ├── userController.js         [DASHBOARD LOGIC - ENHANCED]
│   │   └── twoFactorController.js    [2FA LOGIC]
│   │
│   ├── routes/
│   │   ├── authRoutes.js             [AUTH ENDPOINTS]
│   │   ├── userRoutes.js             [DASHBOARD ENDPOINTS - ENHANCED]
│   │   └── twoFactorRoutes.js        [2FA ENDPOINTS]
│   │
│   ├── middleware/
│   │   ├── userAuth.js               [JWT VERIFICATION]
│   │   └── roleAuth.js               [ROLE CHECK]
│   │
│   ├── model/
│   │   └── usermodel.js              [USER SCHEMA]
│   │
│   └── server.js                     [MAIN SERVER]
│
├── client/src/
│   ├── pages/
│   │   ├── Home.jsx                  [HOME PAGE]
│   │   ├── Login.jsx                 [LOGIN/SIGNUP]
│   │   ├── UserDashboard.jsx         [USER DASHBOARD - NEW]
│   │   ├── AdminDashboard.jsx        [ADMIN/MOD DASHBOARD - ENHANCED]
│   │   ├── Settings.jsx              [USER SETTINGS]
│   │   └── ...
│   │
│   ├── components/
│   │   ├── NavBar.jsx                [NAVIGATION - UPDATED]
│   │   └── Header.jsx                [HEADER]
│   │
│   ├── context/
│   │   ├── AppContext.jsx            [GLOBAL STATE]
│   │   └── AppContextDefinition.jsx  [CONTEXT DEFINITION]
│   │
│   └── App.jsx                       [ROUTER - UPDATED]
│
├── ROLE_BASED_DASHBOARD.md           [COMPREHENSIVE DOCS - NEW]
├── DASHBOARD_SETUP.md                [QUICK SETUP - NEW]
├── DASHBOARD_IMPLEMENTATION_SUMMARY.md [SUMMARY - NEW]
└── DASHBOARD_ARCHITECTURE.md         [THIS FILE - NEW]


═════════════════════════════════════════════════════════════════════════════
                            END OF ARCHITECTURE DIAGRAM
═════════════════════════════════════════════════════════════════════════════
```

## Summary

This architecture provides:

- **3 Dashboard Views**: User, Moderator, Admin
- **Role-Based Access Control**: Middleware-protected routes
- **Real-Time Statistics**: Live data from MongoDB
- **Secure Authentication**: JWT-based with role verification
- **Modular Design**: Reusable components and functions
- **Scalable Structure**: Easy to add new features

For implementation details, refer to:

- **ROLE_BASED_DASHBOARD.md** - Complete documentation
- **DASHBOARD_SETUP.md** - Quick setup guide
- **DASHBOARD_IMPLEMENTATION_SUMMARY.md** - Feature summary
