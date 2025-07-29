import express from 'express';
import { login, logout, register, verifyEmail, sendVerifyOtp, testEmail, testAuth } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';


const authRoutes = express.Router();

authRoutes.post('/C', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRoutes.post('/verify-account', userAuth, verifyEmail);
authRoutes.get('/test-email', testEmail); // Test route for SMTP
authRoutes.post('/test-auth', userAuth, testAuth); // Test route for authentication
authRoutes.get('/health', (req, res) => {
    res.json({ success: true, message: "Server is healthy", timestamp: new Date().toISOString() });
}); // Simple health check

export default authRoutes;