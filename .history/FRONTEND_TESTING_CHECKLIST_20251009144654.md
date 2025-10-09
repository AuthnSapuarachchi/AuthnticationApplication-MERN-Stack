# ✅ Complete Frontend Testing Checklist

## 🚀 Getting Started

### Prerequisites

- ✅ Backend server running on port 4000
- ✅ Frontend dev server running on port 5173
- ✅ MongoDB connected
- ✅ Google Authenticator app installed on phone

---

## 📱 Test Suite 1: Two-Factor Authentication

### Test 1.1: Enable 2FA Flow

**Expected Time:** 5 minutes

| Step | Action                                 | Expected Result                      | ✓   |
| ---- | -------------------------------------- | ------------------------------------ | --- |
| 1    | Navigate to http://localhost:5173      | Home page loads                      | ☐   |
| 2    | Click "Login" or login button          | Login page loads                     | ☐   |
| 3    | Enter credentials and login            | Logged in, redirected to home        | ☐   |
| 4    | Click profile avatar (top right)       | Dropdown menu appears                | ☐   |
| 5    | Click "Settings"                       | Settings page loads                  | ☐   |
| 6    | Check 2FA section                      | Shows "Status: ✗ Disabled"           | ☐   |
| 7    | Click "Enable 2FA" button              | Redirected to 2FA Setup page         | ☐   |
| 8    | Verify progress indicator shows step 1 | Step 1 is highlighted                | ☐   |
| 9    | Check QR code displays                 | QR code image visible                | ☐   |
| 10   | Check manual entry code shows          | Secret code visible with Copy button | ☐   |
| 11   | Open Google Authenticator app          | App opens                            | ☐   |
| 12   | Scan QR code with app                  | Account added with 6-digit code      | ☐   |
| 13   | Click "Next: Verify Code"              | Step 2 loads                         | ☐   |
| 14   | Enter 6-digit code from app            | Code entered                         | ☐   |
| 15   | Click "Verify & Enable"                | Step 3 loads                         | ☐   |
| 16   | Verify 10 backup codes display         | 10 codes visible in 2 columns        | ☐   |
| 17   | Click "📥 Download Codes"              | File downloads                       | ☐   |
| 18   | Click "Finish Setup"                   | Redirected to Settings               | ☐   |
| 19   | Check 2FA status                       | Shows "Status: ✓ Enabled"            | ☐   |
| 20   | Check backup codes count               | Shows "Backup codes remaining: 10"   | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 1.2: Login with 2FA Flow

**Expected Time:** 3 minutes

| Step | Action                        | Expected Result                       | ✓   |
| ---- | ----------------------------- | ------------------------------------- | --- |
| 1    | Click profile → Logout        | Logged out                            | ☐   |
| 2    | Click "Login"                 | Login page loads                      | ☐   |
| 3    | Enter email and password      | Credentials entered                   | ☐   |
| 4    | Click "Login"                 | Redirected to 2FA Verify page         | ☐   |
| 5    | Check page title              | "Two-Factor Authentication" displayed | ☐   |
| 6    | Check 6 input boxes visible   | 6 individual digit inputs shown       | ☐   |
| 7    | Open Google Authenticator app | Get current 6-digit code              | ☐   |
| 8    | Enter first digit             | Auto-focus moves to next box          | ☐   |
| 9    | Enter remaining 5 digits      | All digits entered, auto-focus moves  | ☐   |
| 10   | Click "Verify"                | Successfully logged in                | ☐   |
| 11   | Check redirection             | Home page loads                       | ☐   |
| 12   | Check user data loaded        | Profile avatar shows                  | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 1.3: 2FA Paste Functionality

**Expected Time:** 2 minutes

| Step | Action                          | Expected Result            | ✓   |
| ---- | ------------------------------- | -------------------------- | --- |
| 1    | Logout and return to login      | Login page                 | ☐   |
| 2    | Login with credentials          | 2FA Verify page loads      | ☐   |
| 3    | Get code from authenticator app | Copy code (e.g., 123456)   | ☐   |
| 4    | Click first input box           | First box focused          | ☐   |
| 5    | Press Ctrl+V (paste)            | All 6 digits auto-populate | ☐   |
| 6    | Check last box is focused       | 6th box has focus          | ☐   |
| 7    | Click "Verify"                  | Successfully logged in     | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 1.4: Use Backup Code

**Expected Time:** 3 minutes

| Step | Action                            | Expected Result                      | ✓   |
| ---- | --------------------------------- | ------------------------------------ | --- |
| 1    | Logout and return to login        | Login page                           | ☐   |
| 2    | Login with credentials            | 2FA Verify page loads                | ☐   |
| 3    | Click "Use backup code instead →" | Input changes to single 8-char field | ☐   |
| 4    | Enter one of the backup codes     | Code entered                         | ☐   |
| 5    | Click "Verify"                    | Successfully logged in               | ☐   |
| 6    | Navigate to Settings              | Settings page loads                  | ☐   |
| 7    | Check backup codes count          | Shows "9" (one used)                 | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 1.5: Regenerate Backup Codes

**Expected Time:** 3 minutes

| Step | Action                          | Expected Result                 | ✓   |
| ---- | ------------------------------- | ------------------------------- | --- |
| 1    | In Settings page                | 2FA section visible             | ☐   |
| 2    | Click "Regenerate Backup Codes" | Modal opens                     | ☐   |
| 3    | Check modal title               | "Regenerate Backup Codes" shown | ☐   |
| 4    | Enter password                  | Password entered                | ☐   |
| 5    | Click "Regenerate"              | New codes display in modal      | ☐   |
| 6    | Count codes                     | 10 new codes visible            | ☐   |
| 7    | Click "📥 Download"             | File downloads                  | ☐   |
| 8    | Click "Close"                   | Modal closes                    | ☐   |
| 9    | Check backup codes count        | Shows "10" (reset)              | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 1.6: Disable 2FA

**Expected Time:** 2 minutes

| Step | Action                 | Expected Result                      | ✓   |
| ---- | ---------------------- | ------------------------------------ | --- |
| 1    | In Settings page       | 2FA section visible                  | ☐   |
| 2    | Click "Disable 2FA"    | Modal opens                          | ☐   |
| 3    | Check warning message  | Warning about reduced security shown | ☐   |
| 4    | Enter password         | Password entered                     | ☐   |
| 5    | Click "Disable 2FA"    | Success toast appears                | ☐   |
| 6    | Check 2FA status       | Shows "Status: ✗ Disabled"           | ☐   |
| 7    | Logout and login again | No 2FA verification required         | ☐   |
| 8    | Check login flow       | Direct login to home page            | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

## 👑 Test Suite 2: Role-Based Access Control

### Test 2.1: User Role (Default)

**Expected Time:** 3 minutes

| Step | Action                           | Expected Result                  | ✓   |
| ---- | -------------------------------- | -------------------------------- | --- |
| 1    | Login as regular user            | Home page loads                  | ☐   |
| 2    | Check home page buttons          | Only "Settings" button visible   | ☐   |
| 3    | Check navbar dropdown            | "Settings" and "Logout" visible  | ☐   |
| 4    | Verify no dashboard option       | No "Admin Dashboard" in dropdown | ☐   |
| 5    | Navigate to Settings             | Settings page loads              | ☐   |
| 6    | Check role badge                 | Shows "user" badge               | ☐   |
| 7    | Try to access `/admin-dashboard` | Access denied, redirected        | ☐   |
| 8    | Check toast message              | "Access denied" toast shown      | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 2.2: Admin Role

**Expected Time:** 5 minutes

**Setup:** Change user role in MongoDB:

```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } });
```

| Step | Action                      | Expected Result                           | ✓   |
| ---- | --------------------------- | ----------------------------------------- | --- |
| 1    | Logout and login again      | Home page loads                           | ☐   |
| 2    | Check home page buttons     | "Settings" + "👑 Admin Dashboard" visible | ☐   |
| 3    | Check navbar dropdown       | "Admin Dashboard" option visible          | ☐   |
| 4    | Navigate to Settings        | Settings page loads                       | ☐   |
| 5    | Check role badge            | Shows "admin" badge in indigo             | ☐   |
| 6    | Click "👑 Admin Dashboard"  | Admin dashboard loads                     | ☐   |
| 7    | Check page title            | "Admin Dashboard" shown                   | ☐   |
| 8    | Check admin section         | Purple gradient section visible           | ☐   |
| 9    | Check admin section icon    | 👑 crown icon displayed                   | ☐   |
| 10   | Check statistics cards      | 3 cards with numbers visible              | ☐   |
| 11   | Check admin privileges list | 5+ privileges listed                      | ☐   |
| 12   | Check moderator section     | Blue gradient section visible             | ☐   |
| 13   | Check moderator icon        | 🛡️ shield icon displayed                  | ☐   |
| 14   | Check RBAC info section     | 3 role types explained                    | ☐   |
| 15   | Check quick actions         | 2 buttons visible                         | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 2.3: Moderator Role

**Expected Time:** 5 minutes

**Setup:** Change user role in MongoDB:

```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "moderator" } }
);
```

| Step | Action                      | Expected Result                            | ✓   |
| ---- | --------------------------- | ------------------------------------------ | --- |
| 1    | Logout and login again      | Home page loads                            | ☐   |
| 2    | Check home page buttons     | "Settings" + "Moderator Dashboard" visible | ☐   |
| 3    | Check navbar dropdown       | "Moderator Dashboard" option visible       | ☐   |
| 4    | Navigate to Settings        | Settings page loads                        | ☐   |
| 5    | Check role badge            | Shows "moderator" badge                    | ☐   |
| 6    | Click "Moderator Dashboard" | Dashboard loads                            | ☐   |
| 7    | Check page title            | "Moderator Dashboard" shown                | ☐   |
| 8    | Check admin section         | **NOT visible** (should be hidden)         | ☐   |
| 9    | Check moderator section     | Blue gradient section visible              | ☐   |
| 10   | Check moderator privileges  | List of privileges shown                   | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

## ⚙️ Test Suite 3: Settings Page

### Test 3.1: Profile Information Display

**Expected Time:** 2 minutes

| Step | Action                | Expected Result                    | ✓   |
| ---- | --------------------- | ---------------------------------- | --- |
| 1    | Navigate to Settings  | Settings page loads                | ☐   |
| 2    | Check profile section | "Profile Information" card visible | ☐   |
| 3    | Check name display    | User's name shown                  | ☐   |
| 4    | Check email display   | User's email shown                 | ☐   |
| 5    | Check role display    | Role badge with correct role       | ☐   |
| 6    | Check account status  | "✓ Verified" or "⚠ Unverified"     | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 3.2: Security Tips Section

**Expected Time:** 1 minute

| Step | Action                       | Expected Result               | ✓   |
| ---- | ---------------------------- | ----------------------------- | --- |
| 1    | Scroll to bottom of Settings | Security Tips section visible | ☐   |
| 2    | Check tips count             | 5 security tips listed        | ☐   |
| 3    | Check icons                  | Checkmark icons on all tips   | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

## 🔄 Test Suite 4: Token Refresh System

### Test 4.1: Automatic Token Refresh

**Expected Time:** 20 minutes (mostly waiting)

| Step | Action                     | Expected Result               | ✓   |
| ---- | -------------------------- | ----------------------------- | --- |
| 1    | Login to application       | Logged in successfully        | ☐   |
| 2    | Open browser DevTools      | Network tab open              | ☐   |
| 3    | Filter for "refresh-token" | Filter applied                | ☐   |
| 4    | Wait 16 minutes            | Access token expires          | ☐   |
| 5    | Navigate to any page       | Page loads successfully       | ☐   |
| 6    | Check Network tab          | `/refresh-token` call made    | ☐   |
| 7    | Check response             | 200 status, new tokens issued | ☐   |
| 8    | Verify still logged in     | User data still accessible    | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

## 🎨 Test Suite 5: UI/UX Features

### Test 5.1: Responsive Design

**Expected Time:** 3 minutes

| Step | Action                          | Expected Result            | ✓   |
| ---- | ------------------------------- | -------------------------- | --- |
| 1    | Open app on desktop             | Full layout displays       | ☐   |
| 2    | Resize window to mobile width   | Layout adapts responsively | ☐   |
| 3    | Check Settings page on mobile   | Cards stack vertically     | ☐   |
| 4    | Check 2FA Setup on mobile       | QR code fits screen        | ☐   |
| 5    | Check Admin Dashboard on mobile | Cards stack properly       | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 5.2: Toast Notifications

**Expected Time:** 3 minutes

| Step | Action                        | Expected Result             | ✓   |
| ---- | ----------------------------- | --------------------------- | --- |
| 1    | Login successfully            | Green success toast appears | ☐   |
| 2    | Try login with wrong password | Red error toast appears     | ☐   |
| 3    | Enable 2FA                    | Success toast appears       | ☐   |
| 4    | Download backup codes         | "Downloaded" toast appears  | ☐   |
| 5    | Copy secret code              | "Copied to clipboard" toast | ☐   |
| 6    | Logout                        | Success toast appears       | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 5.3: Loading States

**Expected Time:** 2 minutes

| Step | Action                  | Expected Result              | ✓   |
| ---- | ----------------------- | ---------------------------- | --- |
| 1    | Click "Login" button    | Button shows "Loading..."    | ☐   |
| 2    | Setup 2FA, click verify | Button shows "Verifying..."  | ☐   |
| 3    | Regenerate backup codes | Button shows "Generating..." | ☐   |
| 4    | Disable 2FA             | Button shows "Disabling..."  | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 5.4: Navigation Flow

**Expected Time:** 3 minutes

| Step | Action                            | Expected Result      | ✓   |
| ---- | --------------------------------- | -------------------- | --- |
| 1    | Click logo on any page            | Returns to home page | ☐   |
| 2    | Click "Back to login" on 2FA page | Returns to login     | ☐   |
| 3    | Click "Back to Home" on dashboard | Returns to home      | ☐   |
| 4    | Use browser back button           | Navigates correctly  | ☐   |
| 5    | Use browser forward button        | Navigates correctly  | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

## 🐛 Test Suite 6: Error Handling

### Test 6.1: Invalid 2FA Code

**Expected Time:** 2 minutes

| Step | Action                              | Expected Result                        | ✓   |
| ---- | ----------------------------------- | -------------------------------------- | --- |
| 1    | Login to 2FA verify page            | Page loads                             | ☐   |
| 2    | Enter incorrect code (e.g., 000000) | Code entered                           | ☐   |
| 3    | Click "Verify"                      | Error toast appears                    | ☐   |
| 4    | Check error message                 | "Invalid verification code" or similar | ☐   |
| 5    | Verify still on 2FA page            | Not logged in                          | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 6.2: Wrong Password for Disable 2FA

**Expected Time:** 2 minutes

| Step | Action                   | Expected Result                 | ✓   |
| ---- | ------------------------ | ------------------------------- | --- |
| 1    | Go to Settings           | Page loads                      | ☐   |
| 2    | Click "Disable 2FA"      | Modal opens                     | ☐   |
| 3    | Enter wrong password     | Password entered                | ☐   |
| 4    | Click "Disable 2FA"      | Error toast appears             | ☐   |
| 5    | Check error message      | "Incorrect password" or similar | ☐   |
| 6    | Verify 2FA still enabled | Status unchanged                | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

### Test 6.3: Unauthorized Access

**Expected Time:** 2 minutes

| Step | Action                           | Expected Result            | ✓   |
| ---- | -------------------------------- | -------------------------- | --- |
| 1    | Logout completely                | Not logged in              | ☐   |
| 2    | Try to access `/settings`        | Redirected to login        | ☐   |
| 3    | Try to access `/2fa-setup`       | Redirected to login        | ☐   |
| 4    | Try to access `/admin-dashboard` | Redirected to login        | ☐   |
| 5    | Check error toast                | "Please login first" shown | ☐   |

**Result:** PASS ☐ / FAIL ☐  
**Notes:** **********************\_\_\_**********************

---

## 📊 Summary Report

### Test Results Overview

| Test Suite     | Total Tests | Passed     | Failed     | Pass Rate   |
| -------------- | ----------- | ---------- | ---------- | ----------- |
| 2FA Features   | 6           | \_\_\_     | \_\_\_     | \_\_\_%     |
| RBAC Features  | 3           | \_\_\_     | \_\_\_     | \_\_\_%     |
| Settings Page  | 2           | \_\_\_     | \_\_\_     | \_\_\_%     |
| Token Refresh  | 1           | \_\_\_     | \_\_\_     | \_\_\_%     |
| UI/UX Features | 4           | \_\_\_     | \_\_\_     | \_\_\_%     |
| Error Handling | 3           | \_\_\_     | \_\_\_     | \_\_\_%     |
| **TOTAL**      | **19**      | **\_\_\_** | **\_\_\_** | **\_\_\_%** |

### Critical Issues Found

1. ***
2. ***
3. ***

### Minor Issues Found

1. ***
2. ***
3. ***

### Recommendations

1. ***
2. ***
3. ***

---

## ✅ Final Checklist

Before going to production:

- ☐ All tests passed
- ☐ No critical bugs found
- ☐ UI is responsive on mobile
- ☐ All toast notifications work
- ☐ Token refresh works automatically
- ☐ Role-based access works correctly
- ☐ 2FA flow is smooth
- ☐ Error handling is proper
- ☐ Documentation is complete
- ☐ Environment variables are set

---

**Tester Name:** ******\_\_\_\_******  
**Date:** ******\_\_\_\_******  
**Browser:** ******\_\_\_\_******  
**OS:** ******\_\_\_\_******

**Overall Status:** ☐ PASS / ☐ FAIL / ☐ NEEDS REVIEW

---

🎉 **Great job testing!** 🎉
