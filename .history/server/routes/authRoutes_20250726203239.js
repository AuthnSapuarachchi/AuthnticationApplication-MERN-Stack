import express from 'express';
import { resgister } from '../controllers/authController.js';


const authRoutes = express.Router();

authRoutes.post('/register', resgister);