# 🧪 2FA Quick Testing Checklist

## Prerequisites

- [x] Server running on http://localhost:4000
- [x] Google Authenticator app installed on phone
- [x] User account created and logged in

---

## Test Flow

### ✅ Step 1: Setup 2FA (5 minutes)

1. **Login to your account**

   ```
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Call setup endpoint**

   ```
   POST /api/2fa/setup
   (cookies sent automatically)
   ```

3. **Save the response**

   - Copy the QR code (base64 image)
   - Save backup codes somewhere safe
   - Note the secret key

4. **Scan QR code**

   - Open Google Authenticator app
   - Tap "+" button
   - Select "Scan QR code"
   - Scan the QR from response

   **OR manually enter:**

   - Tap "Enter a setup key"
   - Account name: Your Email
   - Key: The secret from response
   - Time-based: Yes

---

### ✅ Step 2: Enable 2FA (2 minutes)

1. **Get 6-digit code from Google Authenticator**

   - Wait for current code if it's about to expire
   - Note: Codes change every 30 seconds

2. **Verify the code**

   ```
   POST /api/2fa/verify
   {
     "token": "123456"
   }
   ```

3. **Success Confirmation**
   - Should return: "2FA enabled successfully!"
   - Save the backup codes if displayed again

---

### ✅ Step 3: Test 2FA Login (5 minutes)

1. **Logout**

   ```
   POST /api/auth/logout
   ```

2. **Login again**

   ```
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Check response**

   - Should return: `requires2FA: true`
   - Should say: "Please enter your 2FA code"

4. **Get fresh code from Google Authenticator**

5. **Verify 2FA code**

   ```
   POST /api/2fa/verify-login
   {
     "email": "test@example.com",
     "token": "123456",
     "isBackupCode": false
   }
   ```

6. **Success!**
   - Should return: "2FA verification successful"
   - Cookies should be set
   - You're now logged in

---

### ✅ Step 4: Test Backup Code (3 minutes)

1. **Logout again**

   ```
   POST /api/auth/logout
   ```

2. **Login**

   ```
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Use one backup code**

   ```
   POST /api/2fa/verify-login
   {
     "email": "test@example.com",
     "token": "A1B2C3D4",
     "isBackupCode": true
   }
   ```

4. **Success!**
   - Should login successfully
   - Response shows remaining backup codes (9 left)
   - That backup code is now consumed

---

### ✅ Step 5: Check 2FA Status (1 minute)

```
GET /api/2fa/status
```

**Should return:**

```json
{
  "success": true,
  "data": {
    "enabled": true,
    "backupCodesRemaining": 9
  }
}
```

---

### ✅ Step 6: Regenerate Backup Codes (2 minutes)

```
POST /api/2fa/regenerate-codes
{
  "password": "password123"
}
```

**Should return:**

- 10 new backup codes
- Old backup codes no longer work
- Save new codes!

---

### ✅ Step 7: Disable 2FA (1 minute)

```
POST /api/2fa/disable
{
  "password": "password123"
}
```

**Should return:**

- "2FA disabled successfully"

**Verify:**

- Logout and login again
- Should NOT ask for 2FA code
- Direct login with just email + password

---

## ✅ Test Checklist

- [ ] QR code generated successfully
- [ ] Google Authenticator shows 6-digit code
- [ ] Code verification works
- [ ] 2FA enabled in database
- [ ] Login requires 2FA code
- [ ] Invalid code rejected
- [ ] Valid code accepted
- [ ] Backup code works
- [ ] Backup code consumed after use
- [ ] Status endpoint returns correct info
- [ ] Backup codes regenerated
- [ ] Disable 2FA works
- [ ] Login without 2FA after disabling

---

## 🐛 Troubleshooting

### Code always invalid?

- **Check phone time**: Open Google Authenticator settings → Time correction
- **Wait for new code**: Don't use code that's about to expire
- **Check secret**: Re-setup if secret is wrong

### QR code not scanning?

- **Use manual entry**: Enter the secret key manually
- **Check image format**: QR code should be base64 PNG
- **Try different QR scanner**: Use phone camera or different app

### Lost authenticator app?

- **Use backup codes**: Login with backup code
- **Disable 2FA**: Then setup again
- **Contact support**: If all backup codes used

---

## 📱 Testing on Multiple Devices

1. **Same account on multiple phones:**

   - Scan same QR code on multiple devices
   - All devices show same code at same time
   - Any device can be used to login

2. **Different accounts:**
   - Each account gets unique secret
   - Each account has separate 2FA codes

---

## 🎯 Success Criteria

✅ All test steps passed
✅ No error messages
✅ 2FA works consistently
✅ Backup codes work once
✅ Can enable/disable smoothly
✅ Login flow seamless

---

## 📝 Notes to Save

**Important Information:**

- Backup codes (save in password manager)
- Secret key (in case need to re-setup)
- Test user credentials

**For Demo:**

- Take screenshots of QR code
- Record video of login flow
- Show backup code usage

---

## 🚀 Next Steps After Testing

1. ✅ Build frontend UI for 2FA setup
2. ✅ Create 2FA management page
3. ✅ Add 2FA settings to user dashboard
4. ✅ Email notifications for 2FA events
5. ✅ Recovery flow for lost access

**Time to test: ~20 minutes**
**Difficulty: Easy**

Let me know if any test fails! 🎉
