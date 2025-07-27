import express from 'express';
import { logout, resgister } from '../controllers/authController.js';


const authRoutes = express.Router();

authRoutes.post('/register', resgister);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);