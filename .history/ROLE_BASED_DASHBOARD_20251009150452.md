# Role-Based Dashboard System Documentation

## Overview
This document describes the complete role-based dashboard system implementation with three different dashboard views based on user roles: User, Moderator, and Admin.

## System Architecture

### Backend Components

#### 1. Controllers (`server/controllers/userController.js`)
Enhanced with dashboard-specific functions:

- **getUserData()** - Basic user information
- **getUserDashboard()** - Regular user dashboard data
- **getModeratorDashboard()** - Moderator-specific dashboard data
- **getAdminDashboard()** - Admin-specific dashboard with comprehensive statistics
- **getAllUsers()** - Admin-only endpoint to fetch all users
- **updateUserRole()** - Admin-only endpoint to change user roles

#### 2. Routes (`server/routes/userRoutes.js`)
Role-protected dashboard endpoints:

```javascript
// Dashboard routes
GET /api/user/dashboard/user          // All authenticated users
GET /api/user/dashboard/moderator     // Admin & Moderator only
GET /api/user/dashboard/admin         // Admin only

// Management routes
GET /api/user/all-users               // Admin only
PUT /api/user/update-role             // Admin only
```

#### 3. Middleware (`server/middleware/roleAuth.js`)
Already implemented role-based authorization:
- Accepts single role or array of roles
- Returns 403 if user doesn't have required role
- Used in route protection

### Frontend Components

#### 1. User Dashboard (`client/src/pages/UserDashboard.jsx`)
**Purpose**: Personal dashboard for regular users

**Features**:
- Profile information display
- Account status and verification status
- Security level indicator
- Active sessions count
- Recent activity timeline
- Security recommendations
- Quick actions (Enable 2FA, Verify Email)

**Data Displayed**:
- User name, email, role
- Account age
- 2FA status
- Backup codes remaining
- Last login timestamp
- Account creation date

**Components Used**:
- `StatCard` - Displays key metrics
- `ActivityItem` - Shows recent activity entries

#### 2. Admin Dashboard (`client/src/pages/AdminDashboard.jsx`)
**Purpose**: Comprehensive administration interface

**Features**:
- System-wide statistics
- User distribution by role
- Verification rates
- 2FA adoption rates
- Recent users table
- System health monitoring
- Permission display

**Admin Overview Cards**:
- Total Users
- Verified Users (with percentage)
- 2FA Enabled Users (with percentage)
- New Users This Month
- Admin Count
- Moderator Count

**System Health Section**:
- Status indicator
- Uptime percentage
- API call count
- Average response time

**Recent Users Table**:
- Name, Email, Role
- Verification status
- 2FA status
- Limited to 5 most recent

#### 3. Moderator View (within AdminDashboard)
**Purpose**: Content moderation interface

**Features**:
- User management stats
- Pending reports count
- Resolved issues today
- Recent users list
- Active tasks display

**Moderator Stats Cards**:
- Total Users
- Pending Reports
- Resolved Today

**Active Tasks**:
- Pending Reviews
- Flagged Content
- User Reports

## API Endpoints

### User Dashboard Endpoint
```
GET /api/user/dashboard/user
Authorization: Bearer token
Role: Any authenticated user

Response:
{
  "success": true,
  "dashboard": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true,
      "twoFactorEnabled": true,
      "accountAge": "45 days"
    },
    "stats": {
      "accountStatus": "Verified",
      "securityLevel": "High (2FA Enabled)",
      "backupCodesRemaining": 10,
      "activeSessions": 2
    },
    "recentActivity": {
      "lastLogin": "2024-01-15T10:30:00Z",
      "accountCreated": "2023-12-01T08:00:00Z",
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Moderator Dashboard Endpoint
```
GET /api/user/dashboard/moderator
Authorization: Bearer token
Role: Admin or Moderator

Response:
{
  "success": true,
  "dashboard": {
    "moderator": {
      "name": "Jane Smith",
      "role": "moderator",
      "permissions": ["content_moderation", "user_reports", "view_analytics"]
    },
    "stats": {
      "totalUsers": 1234,
      "verifiedUsers": 1100,
      "unverifiedUsers": 134,
      "users2FA": 980,
      "pendingReports": 23,
      "resolvedToday": 8
    },
    "recentUsers": [...],
    "tasks": {
      "pendingReviews": 12,
      "flaggedContent": 5,
      "userReports": 23
    }
  }
}
```

### Admin Dashboard Endpoint
```
GET /api/user/dashboard/admin
Authorization: Bearer token
Role: Admin only

Response:
{
  "success": true,
  "dashboard": {
    "admin": {
      "name": "Admin User",
      "role": "admin",
      "permissions": ["full_access", "user_management", "system_config", "security_settings"]
    },
    "overview": {
      "totalUsers": 1234,
      "verifiedUsers": 1100,
      "users2FA": 980,
      "newUsersThisMonth": 45,
      "verificationRate": "89.2%",
      "twoFactorAdoptionRate": "79.4%"
    },
    "userDistribution": {
      "admins": 3,
      "moderators": 10,
      "regularUsers": 1221,
      "byRole": [...]
    },
    "security": {
      "users2FA": 980,
      "usersWithoutEmail": 134,
      "activeSessions": 567,
      "suspiciousActivity": 0
    },
    "recentUsers": [...],
    "systemHealth": {
      "status": "Healthy",
      "uptime": "99.9%",
      "apiCalls": 15234,
      "avgResponseTime": "120ms"
    }
  }
}
```

### Get All Users (Admin Only)
```
GET /api/user/all-users
Authorization: Bearer token
Role: Admin only

Response:
{
  "success": true,
  "count": 1234,
  "users": [
    {
      "_id": "...",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "isAccountVerified": true,
      "twoFactorEnabled": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    ...
  ]
}
```

### Update User Role (Admin Only)
```
PUT /api/user/update-role
Authorization: Bearer token
Role: Admin only

Request Body:
{
  "targetUserId": "user_id_here",
  "newRole": "moderator"  // Can be: user, moderator, admin
}

Response:
{
  "success": true,
  "message": "User role updated to moderator",
  "user": {
    "id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "moderator"
  }
}
```

## Frontend Routing

### New Routes Added
```javascript
// In client/src/App.jsx
<Route path='/dashboard' element={<UserDashboard />} />
<Route path='/admin-dashboard' element={<AdminDashboard />} />
```

### Navigation
Users can access dashboards from:
1. **NavBar dropdown menu**:
   - "Dashboard" - Goes to user dashboard (all users)
   - "Admin Dashboard" or "Moderator Dashboard" - Role-specific (admins/moderators only)

2. **Direct URL navigation**:
   - `/dashboard` - User dashboard
   - `/admin-dashboard` - Admin/Moderator dashboard

## Role-Based Access Control

### User Roles
1. **user** (default)
   - Access to personal dashboard
   - View own profile and settings
   - Manage own 2FA settings

2. **moderator**
   - All user permissions +
   - Access to moderation dashboard
   - View user statistics
   - Content moderation tools
   - User report management

3. **admin**
   - All moderator permissions +
   - Full admin dashboard access
   - System configuration
   - User role management
   - Security settings
   - System health monitoring

### Permission Hierarchy
```
Admin
  ├── Full system access
  ├── User management
  ├── System configuration
  └── All moderator permissions
      ├── Content moderation
      ├── User reports
      ├── View analytics
      └── All user permissions
          ├── Personal dashboard
          ├── Profile management
          └── 2FA management
```

## Data Aggregation

### MongoDB Queries Used

#### Total Users
```javascript
const totalUsers = await userModel.countDocuments();
```

#### Verified Users
```javascript
const verifiedUsers = await userModel.countDocuments({ isAccountVerified: true });
```

#### Users with 2FA
```javascript
const users2FA = await userModel.countDocuments({ twoFactorEnabled: true });
```

#### Users by Role
```javascript
const usersByRole = await userModel.aggregate([
  {
    $group: {
      _id: '$role',
      count: { $sum: 1 }
    }
  }
]);
```

#### Recent Users
```javascript
const recentUsers = await userModel.find()
  .select('name email role createdAt isAccountVerified twoFactorEnabled')
  .sort({ createdAt: -1 })
  .limit(10);
```

#### New Users Last 30 Days
```javascript
const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const newUsersLast30Days = await userModel.countDocuments({ 
  createdAt: { $gte: last30Days } 
});
```

## UI Components

### Reusable Components

#### DashboardCard
Displays key metrics with icon and color coding
```javascript
<DashboardCard
  title="Total Users"
  value={1234}
  subtitle="89.2%"  // Optional
  icon="👥"
  color="bg-purple-500"
/>
```

#### StatCard (UserDashboard)
Similar to DashboardCard but with different styling
```javascript
<StatCard
  title="Security Level"
  value="High (2FA Enabled)"
  icon="🔒"
  color="bg-blue-500"
/>
```

#### InfoItem
Displays label-value pairs in a list
```javascript
<InfoItem 
  label="Status" 
  value="Healthy" 
  color="text-green-600" 
/>
```

#### ActivityItem
Shows activity entries with timestamp
```javascript
<ActivityItem
  label="Last Login"
  value={new Date().toLocaleString()}
  icon="🔐"
/>
```

## Security Features

### Access Control
1. **Authentication Required**: All dashboard endpoints require valid JWT token
2. **Role Verification**: roleAuth middleware checks user role before granting access
3. **Token Validation**: userAuth middleware validates JWT before processing request

### Data Protection
1. **Sensitive Data Filtering**: Passwords, OTPs, and secrets are excluded from responses
2. **User-Specific Data**: Users can only access their own dashboard data
3. **Admin Privileges**: Only admins can view all users and modify roles

## Testing the System

### 1. Test User Dashboard
1. Login as regular user
2. Click "Dashboard" in navbar dropdown
3. Verify personal stats are displayed
4. Check security recommendations

### 2. Test Moderator Dashboard
1. Login as moderator user
2. Click "Moderator Dashboard" in navbar
3. Verify moderator stats and tasks
4. Check recent users list

### 3. Test Admin Dashboard
1. Login as admin user
2. Click "Admin Dashboard" in navbar
3. Verify all admin sections display
4. Check system health indicators
5. Verify recent users table
6. Test user role management (if implemented)

### 4. Test Role Protection
1. Try accessing `/admin-dashboard` as regular user
2. Should redirect to home with "Unauthorized" message
3. Try accessing admin endpoints directly
4. Should return 403 Forbidden

## Future Enhancements

### Backend
1. **Real-time Statistics**: WebSocket integration for live data updates
2. **Advanced Analytics**: Time-series data for user growth trends
3. **Export Functionality**: CSV/PDF export of user data
4. **Activity Logging**: Track all admin actions
5. **User Management UI**: Full CRUD operations for users
6. **Bulk Operations**: Batch user role updates

### Frontend
1. **Data Visualization**: Charts and graphs using Chart.js or Recharts
2. **Search & Filter**: Advanced user search and filtering
3. **Pagination**: For large user lists
4. **Real-time Updates**: Live notifications for new users/reports
5. **Dark Mode**: Theme toggle for dashboards
6. **Responsive Tables**: Better mobile view for data tables

### Features
1. **User Activity Logs**: Detailed activity tracking per user
2. **Report Management**: Complete reporting system for moderators
3. **Content Moderation**: Flagging and review system
4. **Email Notifications**: Alert admins of critical events
5. **Role Permissions Customization**: Fine-grained permission control
6. **Audit Trail**: Complete system action history

## Troubleshooting

### Dashboard Not Loading
- Check if user is logged in
- Verify JWT token is valid
- Check backend console for errors
- Ensure database connection is active

### "Unauthorized Access" Error
- Verify user has correct role
- Check roleAuth middleware configuration
- Ensure role field is set in user document

### Stats Not Showing
- Check database has user data
- Verify MongoDB aggregation queries
- Check console for API errors
- Ensure data is being fetched correctly

### Recent Users Empty
- Verify users exist in database
- Check sorting and limit queries
- Ensure proper field selection

## Best Practices

1. **Regular Data Validation**: Validate all incoming data
2. **Error Handling**: Comprehensive try-catch blocks
3. **Loading States**: Show loading indicators during data fetch
4. **Empty States**: Handle cases when no data exists
5. **Role Checks**: Always verify user role on both frontend and backend
6. **Token Refresh**: Implement automatic token refresh
7. **Caching**: Consider caching dashboard data for performance
8. **Rate Limiting**: Protect dashboard endpoints from abuse

## Conclusion

The role-based dashboard system provides a comprehensive, scalable solution for managing users across different permission levels. The modular architecture allows for easy expansion and customization based on future requirements.

For questions or improvements, refer to the main project documentation or contact the development team.
