import express from 'express';
import { login, logout, register, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';


const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRoutes.post('/verify-account', userAuth, verifyEmail);

export default authRoutes;