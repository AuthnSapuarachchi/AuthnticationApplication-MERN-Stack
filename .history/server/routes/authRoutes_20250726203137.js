import express from 'express';


const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {