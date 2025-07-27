import express from 'express';
import { resgister } from '../controllers/authController.js';


const authRoutes = express.Router();

authRoutes.post('/register', resgister);
authRoutes.post('/login', login);
authRoutes.post('/logout', resgister);